#!/usr/bin/env python3
"""Tests for public/contact.php using the real PHP interpreter.

Starts PHP's built-in web server on a temporary copy of the script, replaces sendmail with a capture script, and
checks the emails that would have been sent (headers, encoding, injection attempts) plus validation, spam traps, rate
limiting, hostile requests and the failure path. Needs: php (7.4+) and python3. Run: python3 scripts/test-contact.py
"""
import json, os, glob, subprocess, time, http.client, shutil, email, socket, stat, sys, tempfile
from email import policy

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
BASE = tempfile.mkdtemp(prefix="adinet-contact-test-")
MAIL = BASE + "/mail"
DOCROOT = BASE + "/docroot"
os.makedirs(DOCROOT)
shutil.copy(ROOT + "/public/contact.php", DOCROOT + "/contact.php")
CAPTURE = BASE + "/capture.sh"
with open(CAPTURE, "w") as f:
    f.write('#!/bin/sh\ncat > "%s/$(date +%%s%%N).eml"\n' % MAIL)
os.chmod(CAPTURE, os.stat(CAPTURE).st_mode | stat.S_IEXEC)
with socket.socket() as s:
    s.bind(("127.0.0.1", 0)); PORT = s.getsockname()[1]
TMPDIR = BASE + "/tmp"          # keeps the rate-limit files of this test run separate from the system temp dir
os.makedirs(TMPDIR)

def write_config(extra=""):
    with open(DOCROOT + "/contact-config.php", "w") as f:
        f.write("<?php return ['outbox'=>'%s/outbox.log'%s];\n" % (BASE, extra))

def clear_rate():
    for f in glob.glob(TMPDIR + "/adinet_contact_*"): os.remove(f)

def start(sendmail):
    clear_rate()
    shutil.rmtree(MAIL, ignore_errors=True); os.makedirs(MAIL)
    env = dict(os.environ, TMPDIR=TMPDIR)
    p = subprocess.Popen(["php", "-S", "127.0.0.1:%d" % PORT, "-t", DOCROOT, "-d", "sendmail_path=" + sendmail, "-d", "display_errors=1"],
                         stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, env=env)
    for _ in range(50):
        try:
            socket.create_connection(("127.0.0.1", PORT), 0.2).close(); break
        except OSError:
            time.sleep(0.1)
    return p

def post(body,headers=None,raw=None,method="POST"):
    c=http.client.HTTPConnection("127.0.0.1",PORT,timeout=10); h={"Content-Type":"application/json"}; h.update(headers or {})
    data=raw if raw is not None else json.dumps(body)
    c.request(method,"/contact.php",data if method=="POST" else None,h); r=c.getresponse(); t=r.read().decode(); 
    try: j=json.loads(t)
    except Exception: j=None
    return r.status,j,t,dict(r.getheaders())
good=lambda **k:{**dict(name="Asha Rao",email="asha@example.com",phone="+91 98860 03120",company="Rao & Co",interest="Cloud hosting",domain="raoandco.in",message="We need cloud hosting for two sites.",website="",elapsed=4000),**k}
mails=lambda:sorted(glob.glob(MAIL+"/*.eml"))
ok=bad=0
write_config()
def chk(c,m):
    global ok,bad
    if c: ok+=1
    else: bad+=1; print("FAIL",m)
srv=start(CAPTURE)
try:
    # 1 valid submission
    s,j,t,h=post(good()); chk(s==200 and j=={"ok":True},f"valid -> {s} {t}"); chk(h["Content-Type"].startswith("application/json") and h.get("Cache-Control")=="no-store","json headers")
    chk(len(mails())==1,"one email sent")
    m=email.message_from_bytes(open(mails()[0],"rb").read(),policy=policy.default)
    chk(m["To"]=="sales@adinet.in","To: sales@adinet.in ("+str(m["To"])+")")
    chk(m["Subject"]=="Website enquiry: Cloud hosting","subject "+str(m["Subject"]))
    chk("noreply@127.0.0.1" in m["From"],"From on own host: "+str(m["From"]))
    chk("asha@example.com" in m["Reply-To"] and "Asha Rao" in m["Reply-To"],"Reply-To is the visitor: "+str(m["Reply-To"]))
    body=m.get_body().get_content()
    for needle in ["Asha Rao","asha@example.com","+91 98860 03120","Rao & Co","Cloud hosting","raoandco.in","We need cloud hosting for two sites."]: chk(needle in body,"body has "+needle)
    # 2 unicode
    s,j,t,h=post(good(name="Rahul Śharma",message="Budget ₹50,000 per year, please advise — thanks")); chk(s==200,"unicode ok")
    m=email.message_from_bytes(open(mails()[-1],"rb").read(),policy=policy.default); b=m.get_body().get_content()
    chk("₹50,000" in b and "Śharma" in b,"unicode intact in body"); chk("Rahul Śharma" in str(m["Reply-To"]),"unicode name decoded from encoded Reply-To header")
    # 3 header injection
    n0=len(mails())
    s,j,t,h=post(good(name="Bob\r\nBcc: evil@example.com\r\nX-Evil: 1",interest="IT support\r\nBcc: evil2@example.com")); chk(s==200,f"injection in name still handled ({s})")
    raw=open(mails()[-1],"rb").read().decode("utf8","replace"); head=raw.split("\r\n\r\n",1)[0]
    pm=email.message_from_string(raw,policy=policy.default)
    chk(len(mails())==n0+1 and [k.lower() for k in pm.keys()]==["to","subject","mime-version","content-type","content-transfer-encoding","from","reply-to","x-mailer"],"no extra header fields: "+str(list(pm.keys())))
    chk([a.addr_spec for a in pm["Reply-To"].addresses]==["asha@example.com"],"Reply-To resolves only to the visitor: "+str([a.addr_spec for a in pm["Reply-To"].addresses])+" / "+repr(str(pm["Reply-To"])))
    chk([a.addr_spec for a in pm["To"].addresses]==["sales@adinet.in"] and "evil" not in str(pm["To"])+str(pm["From"]),"To/From untouched")
    chk("Subject: Website enquiry: Something else" in head,"unlisted interest falls back safely")
    s,j,t,h=post(good(email="a@b.co\r\nBcc: evil@example.com")); chk(s==422 and "email" in j["fields"],"CRLF in email rejected")
    # 4 validation
    s,j,t,h=post(good(name="A",email="nope",phone="abc",domain="not a domain",message="short")); chk(s==422 and set(j["fields"])=={"name","email","phone","domain","message"},"field errors "+str(j and j.get("fields")))
    chk(len(mails())==n0+1,"invalid submissions send nothing")
    s,j,t,h=post(good(message="see http://a.com http://b.com http://c.com now please")); chk(s==422 and "message" in j["fields"],"link spam rejected")
    # 5 bots
    n=len(mails()); s,j,t,h=post(good(website="http://spam.example")); chk(s==200 and j=={"ok":True} and len(mails())==n,"honeypot: fake success, nothing sent")
    s,j,t,h=post(good(elapsed=300)); chk(s==422 and len(mails())==n,"too fast rejected")
    d=good(); del d["elapsed"]; s,j,t,h=post(d); chk(s==422 and len(mails())==n,"missing timer rejected")
    # 6 request hygiene
    s,j,t,h=post(None,method="GET"); chk(s==405 and h.get("Allow")=="POST","GET -> 405 + Allow")
    s,j,t,h=post(good(),headers={"Origin":"https://evil.example"}); chk(s==403,"foreign Origin -> 403")
    s,j,t,h=post(good(),headers={"Origin":"http://127.0.0.1:%d"%PORT+""}); chk(s==200,"same Origin ok")
    s,j,t,h=post(None,raw="x"*50000); chk(s==413,f"oversize -> {s}")
    s,j,t,h=post(None,raw="not json"); chk(s==400,"non-JSON -> 400")
    s,j,t,h=post(None,raw='["a"]'); chk(s==422 or s==400,f"JSON array -> {s}")
    for bodytxt in [t]: chk("Warning" not in bodytxt and "Notice" not in bodytxt and "Fatal" not in bodytxt,"no PHP diagnostics leaked")
    # 7 rate limit (fresh state)
    clear_rate()
    codes=[post(good())[0] for _ in range(7)]; chk(codes==[200]*5+[429]*2,"rate limit 5 then 429: "+str(codes))
finally:
    srv.terminate(); srv.wait()
# 8 mail failure: sendmail returns non-zero -> 500, enquiry preserved, no internals leaked
if os.path.exists(BASE+"/outbox.log"): os.remove(BASE+"/outbox.log")
srv=start("/bin/false")
try:
    s,j,t,h=post(good(message="Please call me about the migration, it is urgent.")); chk(s==500 and j["ok"] is False and j["error"]=="We could not send your message right now.","mail failure -> 500 generic: "+t)
    out=open(BASE+"/outbox.log").read() if os.path.exists(BASE+"/outbox.log") else ""
    chk("migration" in out and "asha@example.com" in out,"failed enquiry kept in the outbox file")
    chk("/home" not in t and "Warning" not in t,"no server paths leaked")
finally:
    srv.terminate(); srv.wait()
# 9 optional config override changes the recipient
write_config(",'to'=>'other@example.org','from'=>'forms@adinet.in','subject'=>'Enquiry'")
srv=start(CAPTURE)
try:
    s,j,t,h=post(good()); chk(s==200,"override send ok"); m=email.message_from_bytes(open(mails()[0],"rb").read(),policy=policy.default)
    chk(m["To"]=="other@example.org" and "forms@adinet.in" in m["From"] and m["Subject"].startswith("Enquiry:"),"config override applied: To/From/Subject = "+str((m["To"],m["From"],m["Subject"])))
finally:
    srv.terminate(); srv.wait()
shutil.rmtree(BASE, ignore_errors=True)
print(f"{ok} passed, {bad} failed")
sys.exit(1 if bad else 0)
