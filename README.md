# Detyrat

Task manager minimalist me Angular dhe pamje të frymëzuar nga Apple Reminders.

## Nisja dhe kontrollet

```bash
npm ci
npm start
```

Hap `http://localhost:4200/`. Nëse varësitë janë instaluar, mjafton `npm start`.

```bash
npm run build
npm test -- --watch=false
npm run format:check
```

Për të formatuar kodin, përdor `npm run format`.

## Struktura

```text
src/app/
├── app.ts / app.html / app.css     # Pika hyrëse dhe router outlet
├── app.config.ts                  # Konfigurimi i aplikacionit
├── app.routes.ts                  # Ngarkimi i faqes së detyrave
├── layout/
│   └── workspace-layout/          # Struktura e përbashkët e faqes
├── features/tasks/
│   ├── pages/tasks-page/          # Koordinimi i faqes, kërkimi dhe filtrat
│   ├── components/
│   │   ├── task-sidebar/          # Navigimi sipas statusit
│   │   ├── task-toolbar/          # Kërkimi
│   │   ├── task-progress/         # Përmbledhja e progresit
│   │   ├── task-form/             # Shtimi i një detyre
│   │   ├── task-list/             # Lista dhe gjendjet bosh
│   │   ├── task-item/             # Paraqitja e një detyre
│   │   └── task-editor/           # Ndryshimi dhe anulimi i ndryshimeve
│   ├── config/                   # Tekstet dhe ikonat e filtrave
│   ├── data/                     # Detyrat fillestare për demonstrim
│   ├── forms/                    # Typed reactive forms dhe validuesit Angular
│   ├── models/                   # Tipet e detyrave dhe filtrave
│   ├── services/                 # Gjendja e detyrave dhe veprimet mbi to
│   └── utils/                    # Validimi dhe normalizimi i përbashkët
└── shared/ui/icon/                # Ikonat e ripërdorshme
```

## Përgjegjësitë

- `App` ngarkon faqen përmes router-it. Rrugët e panjohura kthehen te faqja kryesore.
- `WorkspaceLayout` përcakton strukturën dhe sjelljen responsive. Përmbajtjen e merr përmes `ng-content`; nuk varet nga funksionaliteti i detyrave.
- `TasksPage` lidh komponentët me `TaskStore` dhe mban gjendjen lokale të kërkimit dhe filtrit.
- `TaskStore` zotëron listën, krijon identifikuesit dhe kryen shtimin, ndryshimin dhe përfundimin e detyrave. Numëruesit dhe progresi llogariten nga lista.
- Komponentët e pamjes marrin të dhëna me `input()` dhe dërgojnë veprime me `output()`. Formularët mbajnë vetëm të dhënat që po shkruhen.
- `TaskEditor` mban një kopje lokale gjatë ndryshimit. Anulimi nuk prek detyrën origjinale.
- `createTaskForm` krijon formularë reaktivë me kontrolle `FormControl<string>` dhe `nonNullable`. Shtimi dhe ndryshimi përdorin të njëjtin model formulari; secili ka instancën e vet. Statusi lidhet me `toSignal` për përditësime me `OnPush`.
- Rregullat në `task-validation.ts` përdoren si nga validuesit Angular, ashtu edhe nga `normalizeTaskDraft` në shërbim. Kufijtë përcaktohen vetëm te `TASK_LIMITS`.

Çdo komponent ka skedarë të veçantë `.ts`, `.html` dhe `.css`. Stilet specifike qëndrojnë te komponenti; variablat e dizajnit, butonat e përbashkët dhe rregullat bazë janë te `src/styles.css`.

## Gjendja dhe ruajtja

`TaskStore` ofrohet në nivelin e `TasksPage`. Gjendja nuk është globale dhe nuk mbahet në komponentët e pamjes.

Detyrat ruhen vetëm në memorien e aplikacionit. Rifreskimi i faqes i rikthen detyrat fillestare. Ky version nuk përdor backend ose `localStorage`.

## Verifikimi

Kontrollet strikte të TypeScript dhe Angular templates janë aktive. Testet mbulojnë ngarkimin e faqes përmes router-it, shtimin, validimin, filtrimin dhe kërkimin së bashku, progresin, ruajtjen dhe anulimin e ndryshimeve, si dhe veprimet e shërbimit. Testet qëndrojnë pranë kodit përkatës.
