![Form](./src/images/form.png)

# **TDD Search Form**

This form has been developed applying Test Driven Development with
[<img src = "https://img.shields.io/badge/-React-61DAFB?style=for-the-badge&logo=react&logoColor=black">](https://es.reactjs.org/),
[<img src = "https://img.shields.io/badge/-Jest-C21325?style=for-the-badge&logo=jest&logoColor=white">](https://jestjs.io/),
[<img src = "https://img.shields.io/badge/-Testing Library-E33332?style=for-the-badge&logo=testing-library&logoColor=white">](https://testing-library.com/),
[<img src = "https://img.shields.io/badge/-Mock_Service_Worker-E95420?style=for-the-badge">](https://mswjs.io/)
and
[<img src = "https://img.shields.io/badge/-Material_UI-0081CB?style=for-the-badge&logo=material-ui&logoColor=white">](https://material-ui.com/)

This exercise is part of the
[**Test Driven Development (TDD) en React JS**](https://www.udemy.com/course/tdd-react-js/?referralCode=F40803D2C4D2934AB038)
course.

**NOTE:** a [**mock server**](https://mswjs.io/) and the
[**Github REST API**](https://docs.github.com/en/rest/overview/resources-in-the-rest-api) have been used to develop this exercise.

## **Quick start guide**

Instructions to start this project:

### Installation

- Clone repository:

```
git clone [repository]
```

- Install NPM packages and dependencies:

```
npm install
```

- Run project on local server

```
npm start
```

- [**Project URL**](https://anaguerraabaroa.github.io/react-tdd-search-form/) is also available on GitHub Pages.

### Tests

- Run tests:

```
npm run test
```

## **Project features**

**Github Repositories List**

As a developer, I want to take a quick look at the github repositories as a way
of inspiring me to be better professional.

**Acceptance Criteria**

- There must be a github repositories list page.

- The page should contain the next filters:

  - An input text with label "filter by" field in order to do the search.
  - The Search Button.

- The results section should contain:
  - Before the first search, show the initial state message “Please provide a
    search option and click in the search button”.
  - The search button should be disabled until the search is done.
  - The data should be displayed as a sticky table.
  - The header table should contain: Repository, stars, forks, open issues and
    updated at
  - Each result should have: owner avatar image, name, stars, updated at, forks,
    open issues. It should have a link that opens in a new tab the github
    repository selected.
  - Total results number of the search and the current number of results.
    Example: 1-10 of 100.
  - A results size per page select/combobox with the options: 30, 50, 100. The
    default is 30.
  - Next and previous pagination when the context applies to them, example: on
    the first page, the previous page should be disabled.
  - If there is no results, then show a empty state message “You search has no
    results”
- Handling filter:
  - If the developer types "ruby" in the filter by repository name input and
    clicks on search, the app should return repositories with the "ruby" word
    associated.
- Size per page:
  - If the developer clicks on search button and then selects 50 per page value,
    the app should show 50 repositories on the table
- Pagination:
  - If the developer clicks on search and then on next page button, the app
    should show the next repositories.
  - If the developer clicks on search and then on next page button and then
    clicks on previous button, the app should show the previous repositories.
- Handling errors:
  - If there is an unexpected error from the frontend app, the app should show a
    message “There is an unexpected error” and a reload button.
  - If there is an unexpected error from the backend, the app should display an
    alert message error with the message from the service if any, if not show
    the generic “there is an unexpected error”.

## **Folder Structure**

```
React TDD Search Form
├── docs
├── node_modules
├── public
├── src
│   ├── __fixtures__
│   │   ├── handlers.js
│   │   ├── repos-30-paginated.json
│   │   ├── repos-50-paginated.json
│   │   └── repos.js
│   ├── components
│   │    ├── content
│   │    │   └── index.js
│   │    ├── error-boundary
│   │    │   ├── error-boundary.js
│   │    │   ├── error-boundary.test.js
│   │    │   └── index.js
│   │    ├── github-search-page
│   │    │   ├── github-search-page.integration.test.js
│   │    │   ├── github-search-page.js
│   │    │   ├── github-search-page.test.js
│   │    │   └── index.js
│   │    └── github-table
│   │        └── index.js
│   ├── const
│   │    └── index.js
│   ├── images
│   │    └── form.png
│   ├── services
│   │    └── index.js
│   ├── App
│   │── index.js
│   └── setupTests.js
|── .eslintrc
├── .env
├── .gitignore
├── .prettierrc
├── package-lock.json
├── package.json
└── README.md
```
