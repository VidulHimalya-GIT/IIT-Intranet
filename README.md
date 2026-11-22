# IIT Intranet

Front-end prototype of a redesigned student intranet for the Informatics Institute of Technology (IIT), Sri Lanka. Built for the 5COSC021C Agile Team Project at the University of Westminster.

The pages are plain HTML, CSS and JavaScript. Sign-in is simulated, so any email and password opens the dashboard, and document links only show a message for now.

## Run it

Open the folder in VS Code and start `iit_intranet_portal.html` with Live Server, or serve the folder with any static server:

```
python -m http.server 5510
```

Then open http://localhost:5510/iit_intranet_portal.html.

## Pages

| Page | File |
| --- | --- |
| Sign in | `iit_intranet_portal.html` |
| Overview | `student-dashboard.html` |
| Schedules and calendars | `schedules.html` |
| Academic resources | `academics.html` |
| Student services | `student-services.html` |
| Policies and forms | `policies-forms.html` |
| Campus life | `campus-life.html` |
| Help and support | `help-support.html` |

## Styling

Icons are Font Awesome 6.4.0, stored in `vendor/fontawesome`. The sign-in page uses `portal.css`, built with Tailwind CSS 3.4 from `iit_intranet_portal.html`. After changing Tailwind classes on that page, rebuild it in this folder:

```
npx tailwindcss@3.4.17 -o portal.css --minify
```

## Contributors

- **Jithvin** designed and built the sign-in page (`iit_intranet_portal.html`).
- **Sanuka and Jithvin** designed and built the rest of the portal: the overview dashboard, the six section pages, the sidebar and top bar, and the page styling and scripts.
- **Vidul Himalya** made accessibility, layout and design fixes: working search, keyboard-friendly pop-ups, the phone menu, offline icons and styling, larger text and better contrast, and a cleaner dashboard.
