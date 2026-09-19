⚠️This skill for listening on your own devices. Publishing a skill to relay a radio station in the __**public**__ Alexa Skills Store needs that station's __**written permission**__.

# Radio Waters — Alexa skill

Play Radio Waters on your Echo by saying **"Alexa, open radio waters"**.


## What you need

- An Echo device
- The Amazon account your Echo is signed in to
- The two files in this repo: `interaction-model.json` and `index.js`

---

## Step 1 — Sign in to the Alexa Developer Console

Go to **https://developer.amazon.com/alexa/console/ask**

Sign in with **the same Amazon account your Echo uses**.

> ⚠️ This is the one thing people get wrong. If you sign in with a different Amazon account, the skill will work in the browser but will never appear on your Echo.

First time here? Amazon will ask for a few developer profile details. It is free and it will not ask for a card.

---

## Step 2 — Create the skill

1. Click the blue **Create Skill** button.
2. **Skill name:** type `Radio Waters`
3. **Primary locale:** choose **English (UK)**
4. Click **Next**.
5. Under **Type of experience**, choose **Other**.
6. Under **Model**, choose **Custom**.
7. Under **Hosting services**, choose **Alexa-hosted (Node.js)**.
8. Click **Next**.
9. Under **Templates**, choose **Start from Scratch**.
10. Click **Next**, then **Create Skill**.

Now wait. Amazon builds your skill in the background. This takes a minute or two. Do not close the tab.

---

## Step 3 — Turn on Audio Player

You are now on the **Build** tab.

1. In the left-hand menu, click **Interfaces**.
2. Find **Audio Player** and click the toggle so it turns on.
3. Click **Save Interfaces** at the top.

> Do this **before** Step 4 or Step 4 will fail.

---

## Step 4 — Paste in the voice model

1. In the left-hand menu, click **Interaction Model**, then click **JSON Editor**.
2. Click anywhere in the big box of code.
3. Select everything and delete it. Press `Ctrl+A` then `Delete`.
4. Open `interaction-model.json` from this repo, copy **all** of it, and paste it into the empty box.
5. Click **Save Model** at the top.
6. Click **Build Model** at the top.

Wait for the green **Build Successful** message. This takes a minute.

---

## Step 5 — Paste in the code

1. At the very top of the page, click the **Code** tab.
2. You will see a file list on the left. Click **index.js**.
3. Click into the code, then select everything and delete it. Press `Ctrl+A` then `Delete`.
4. Open `index.js` from this repo, copy **all** of it, and paste it into the empty editor.
5. Click **Save** at the top right.
6. Click **Deploy** at the top right.

Wait for the message saying the deployment succeeded.

> Do not touch `package.json` or any other file. Only `index.js`.

---

## Step 6 — Switch testing on

1. At the very top of the page, click the **Test** tab.
2. At the top left there is a dropdown that says **Off**. Change it to **Development**.

That is it. Your skill is now live on your own Echo devices.

---

## Step 7 — Try it

Say to your Echo:

> **"Alexa, open radio waters"**

She will say "Starting Radio Waters" and the music will begin.

To stop it:

> **"Alexa, stop"**

---

## If it doesn't work

**"I don't know that one" or "I can't find that skill"**
You are signed in to the developer console with a different Amazon account than your Echo uses. Check the account, and check the Test tab dropdown is on **Development**, not Off.

**The model won't build in Step 4**
Go back to Step 3 and make sure Audio Player is toggled on and you clicked **Save Interfaces**.

**Alexa says "Starting Radio Waters" then nothing happens**
Give it 10 seconds, as it can be slow to buffer. If it is still silent, your Echo may be too far from your router. Try moving it closer and asking again.

**Nothing happens at all when you speak**
Make sure you say "open radio waters", not "play radio waters". Say it slowly.

---

## Changing to a different station

Open `index.js`, change the address on this line near the top, then repeat Step 5:

```javascript
const STREAM_URL = 'https://uk5.internet-radio.com/stream/radiowaters/stream.pls';
```

The address must start with `https://`. A plain `http://` address will not work.

---
