I want you to rewrite the content for one Rasi page in my LabHari Panchangam website by grounding it in the authentic source page I provide.

Goal:
Keep my current LabHari UI, styling, section order, card layout, spacing, and overall structure exactly the same. Only replace the written content so it becomes faithful to the source Rasi page. Do not redesign the page. Do not add unnecessary sections. Do not remove existing useful sections.

Task:
Carefully study:
1. my current LabHari Rasi page
2. the authentic source Rasi page

Then map the source content into my LabHari website structure and rewrite the full page content in clean, web-friendly English.

Rasi details:
- Rasi name: [RASI_NAME]
- English name: [ENGLISH_NAME]
- Year: [YEAR_NAME_AND_RANGE]
- Nakshatras covered: [NAKSHATRA_DETAILS]
- Date range: [DATE_RANGE]
- Source page: [SOURCE_PAGE]

Annual indicators:
- Income: [ADAYAM_VALUE]
- Expenditure: [VYAYAM_VALUE]
- Royal Favor / Recognition: [RAJA_POOJYAM_VALUE]
- Dishonor / Challenges: [AVAMANAM_VALUE]
- Balance / Remainder: [SHESHA_VALUE]

Core instructions:
- Keep the current LabHari visual structure exactly as it is.
- Rewrite all incorrect, generic, repetitive, or hallucinated content.
- Ground every statement in the source page.
- Use polished modern English while preserving traditional astrology terms where useful.
- Do not invent remedies, gemstones, rituals, mantras, career guarantees, marriage guarantees, or health claims unless clearly supported by the source.
- Do not copy ads, promos, CTA clutter, WhatsApp links, book promotions, or website marketing text from the source.
- Condense repeated source content into one strong clean version.
- Tone should feel authentic, grounded, traditional, calm, and premium.

Use this exact section order:
1. Back to Rasi Selection
2. Hero Card
3. Annual Indicators
4. Yearly Theme
5. Opportunities
6. Cautions
7. Studies & Career
8. Family & Relationships
9. Health & Wellbeing
10. Planetary Influences
11. Spiritual Guidance
12. Monthly Highlights
13. Source Note

Section instructions:

1. Hero Card
Write:
- small year label
- Rasi name
- English name
- date range
- short intro paragraph summarizing the overall tone of the year

2. Annual Indicators
Show these in English:
- Income
- Expenditure
- Royal Favor / Recognition
- Dishonor / Challenges
- Balance / Remainder

3. Yearly Theme
Write one strong paragraph summarizing the overall year based on the source:
- major positives
- major cautions
- strongest supporting planets
- most difficult planetary influences
- overall tone of the year

4. Opportunities
Write concise grounded points covering areas like:
- career
- recognition
- studies
- travel
- finances
- family progress
- spiritual movement
Only include what is supported by the source.

5. Cautions
Write concise grounded points covering areas like:
- delays
- expenses
- emotional strain
- legal/pressure-heavy periods
- family friction
- health discipline
Only include what is supported by the source.

6. Studies & Career
Write a clean paragraph about students, employees, job seekers, and businesspeople if the source supports those points.

7. Family & Relationships
Write a balanced paragraph about family harmony, spouse, children, relatives, domestic peace, and emotional tone if supported by the source.

8. Health & Wellbeing
Write a grounded paragraph about stress, fatigue, health discipline, restlessness, recovery, or sensitive periods if supported by the source.
Do not exaggerate.

9. Planetary Influences
Create separate content blocks for each relevant planet mentioned in the source, such as:
- Guru / Jupiter
- Shani / Saturn
- Rahu
- Ketu
Explain clearly whether each is favorable, unfavorable, or mixed, and what areas it affects.

10. Spiritual Guidance
Write a short grounding paragraph about patience, discipline, humility, prayer, pilgrimage, timing, or steady effort if supported by the source.
Keep it calm and non-preachy.

11. Monthly Highlights
Rewrite each month in concise, web-friendly English.
Keep each month around 80-130 words.
Do not sound like generic horoscope filler.
Preserve important caution dates or favorable dates only if they are clearly present in the source.

12. Source Note
Write a short note saying the page is a web-adapted reading of the original forecast, reorganized for cleaner reading while preserving traditional meaning.

Writing rules:
- Keep all styling hooks and structure intact
- Replace only content
- Use clean modern English
- Preserve traditional terms where helpful
- Do not repeat the same sentence across sections
- Do not overhype positive or negative results
- Do not invent content
- Remove filler
- Make it feel authentic and premium

Output format:
Return only the final ready-to-paste structured content object for the frontend.

This repo uses JSON-like content. Return a clean object with these exact keys:
- slug
- yearTitle
- overview
- yearlyTheme
- opportunities
- caution
- studiesCareer
- familyRelationships
- healthWellbeing
- blessing
- annualMetrics
- planetaryInfluences
- monthlyHighlights
- sourceNote

Content mapping for this codebase:
- Hero Card intro -> overview
- Cautions -> caution
- Spiritual Guidance -> blessing
- Source Note -> sourceNote
- annualMetrics must keep keys: adayam, vyayam, rajaPoojyam, avamanam, seshaNumber
- monthlyHighlights must be an array of objects with: monthLabel, summary, favorableDates, cautionDates
- planetaryInfluences must be an array of objects with: planet, effect, summary, remedyNote
- effect must be one of: favorable, unfavorable, mixed

For the annual indicators in English, use these labels:
- Adayam -> Income
- Vyayam -> Expenditure
- Raja Poojyam -> Royal Favor / Recognition
- Avamanam -> Dishonor / Challenges
- Shesha -> Balance / Remainder

Do not explain.
Do not summarize.
Just return the final content object.
