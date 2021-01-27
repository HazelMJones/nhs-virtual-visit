import React from "react";

const Pagination = ({ previousHref, previousName, nextHref, nextName }) => {
  console.log(previousName);

  return (
    <nav className="nhsuk-pagination" role="navigation" aria-label="Pagination">
      <ul className="nhsuk-list nhsuk-pagination__list">
        {previousName ? (
          <li className="nhsuk-pagination-item--previous">
            <a
              className="nhsuk-pagination__link nhsuk-pagination__link--prev"
              href={previousHref}
            >
              <span className="nhsuk-pagination__title">Previous</span>
              <span className="nhsuk-u-visually-hidden">:</span>
              <span className="nhsuk-pagination__page">{previousName}</span>
              <svg
                className="nhsuk-icon nhsuk-icon__arrow-left"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path d="M4.1 12.3l2.7 3c.2.2.5.2.7 0 .1-.1.1-.2.1-.3v-2h11c.6 0 1-.4 1-1s-.4-1-1-1h-11V9c0-.2-.1-.4-.3-.5h-.2c-.1 0-.3.1-.4.2l-2.7 3c0 .2 0 .4.1.6z" />
              </svg>
            </a>
          </li>
        ) : null}

        {nextName ? (
          <li className="nhsuk-pagination-item--next">
            <a
              className="nhsuk-pagination__link nhsuk-pagination__link--next"
              href={nextHref}
            >
              <span className="nhsuk-pagination__title">Next</span>
              <span className="nhsuk-u-visually-hidden">:</span>
              <span className="nhsuk-pagination__page">{nextName}</span>
              <svg
                className="nhsuk-icon nhsuk-icon__arrow-right"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path d="M19.6 11.66l-2.73-3A.51.51 0 0 0 16 9v2H5a1 1 0 0 0 0 2h11v2a.5.5 0 0 0 .32.46.39.39 0 0 0 .18 0 .52.52 0 0 0 .37-.16l2.73-3a.5.5 0 0 0 0-.64z" />
              </svg>
            </a>
          </li>
        ) : null}
      </ul>
    </nav>
  );
};

export { Pagination };
