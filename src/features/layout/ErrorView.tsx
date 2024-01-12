import { isRouteErrorResponse, useRouteError } from 'react-router-dom';
import Navigation from './Navigation';

export default function ErrorView() {
  const error = useRouteError();
  console.error(error);

  return (
    <div id="error-page">
      <Navigation />
      <h1>Oops!</h1>
      <p>Sorry, an unexpected error has occurred.</p>

      {isRouteErrorResponse(error) && (
        <p>
          <i>{error.statusText}</i>
        </p>
      )}
      {error instanceof Error && (
        <p>
          <i>{error.message}</i>
          <hr />
          <pre>{error.stack}</pre>
        </p>
      )}
    </div>
  );
}
