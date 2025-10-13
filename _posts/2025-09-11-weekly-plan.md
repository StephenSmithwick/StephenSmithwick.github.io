---
layout: post
title:  My Weekly Work Plan
categories: work
published: true
last_edit: 2025-09-22
---

Balancing work, household responsibilities, and professional growth during school hours is a challenge.  I want a system to focus me on a few key things, track progress and build habits to increase my productivity even more.  Inspired by [How to Make Doing Hard Things Easier](https://www.youtube.com/watch?v=-2jZ-iOR8p4), I created a weekly/daily plan and printable sheet to track and reflect on my progress.

## Weekly
Each week I focus on 1-2 projects and professional development. That limit forces me to prioritise and prevents spreading effort too thin. During weekdays I will take advantage of what time I have available outside of looking after my boys and chores to work on projects and learn more. Every weekend I review my work projects and pick a focus theme for next week.

Additionally, I can track extra project work that I pick up through the week.

## Daily

{:.printable}
8:00-8:30 
: **Startup & Focus Prep**{:.dark-green}
: Review the day's goals and choose a max of 3
: Do a 5-minute “activation” (coffee, short walk, upbeat music).

8:30-10:30 
: **Deep Work Block 1**{:.dark-green}
: 2 × 50-minute sprints with 10-min breaks.
: Focus on the important creative project work here (coding, writing, design).
: This is when my energy is highest, so I put the hardest work here.
: End by committing code.

10:30-11:30 
: **Chores / Movement**{:.dark-green}
: Do household chores, errands, or exercise.
: I can skill stack by listening to podcasts and audiobooks related to software engineering.

11:30-1:00 
: **Deep Work Block 2**{:.dark-green}
: 2 × 30-40 minute sprints.
: Pick a skill-building focus (e.g., practicing algorithms, reading source code, learning a new framework).
: End with writing a blog post on what I learned (builds memory and reinforces dopamine).

1:00-1:30 
: **Lunch + Reset**{:.dark-green}
: Eat, go outside, walk if possible. No screens if I can avoid them.

1:30-2:15 
: **Shallow Work / Admin**{:.dark-green}
: Respond to emails, organize code repos, small bug fixes, plan tomorrow.
: Keep it light but useful.

2:15-2:30 
: **Wrap-up Ritual**{:.dark-green}
: Look at my 3 goals from the morning.
: Check off what I did.
: For a smoother start tomorrow: write the top tasks in advance.

##  Building a physical page to track

A paper planner pulls me away from screens and makes progress visible, even when the computer is off. 
I built a simple weekly worksheet in LaTeX that reflects this system.  I started by modifying a LaTeX document supplied by ChatGPT and ended up with this file: **[{% include github-icon.html %} weekly-plan.tex]({{ site.github_urls.blob }}/weekly-plan/weekly-plan.tex)**

To compile the PDF:
```bash
brew install basictex
# reload terminal
xelatex weekly-plan.tex
```

Here is the result: 

<object data="../weekly-plan/weekly-plan.pdf" type="application/pdf" width="100%" height="700px">
    <embed src="../weekly-plan/weekly-plan.pdf">
        <p>This browser does not support PDFs. Please download the PDF to view it.
    </embed>
</object>

Download: [weekly-plan.pdf]({{ site.github_urls.raw }}/weekly-plan/weekly-plan.pdf)
