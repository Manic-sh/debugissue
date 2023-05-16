import {BuilderComponent, builder} from '@builder.io/react';
import {Builder} from '@builder.io/sdk';
import {useLoaderData} from '@remix-run/react';

// Initialize the Builder client and pass in your Public API Key
builder.init('0eed6b8cdef047658652879b5de72b72'); // <-- add your Public API Key here

// Fetch contents of the page
export const loader = async ({request, context: {storefront}}) => {
  // Fetch data content from Builder.io based on the URL path
  const page = await builder
    .get('page', {
      userAttributes: {
        urlPath: `/builders/testing`,
      },
      entry:
        '0eed6b8cdef047658652879b5de72b72_d03bd582871b4f3fa5bcfcc501c9789e',
    })
    .toPromise();
  // Verify the user is previewing or editing in Builder
  const isPreviewing = Builder.isEditing || Builder.isPreviewing;

  // If the page is not found and the user is not previewing, throw a 404.
  // The CatchBoundary component will catch the error
  if (!page && !isPreviewing) {
    throw new Response('Page Not Found', {
      status: 404,
      statusText:
        "We couldn't find this page, please check your url path and if the page is published on Builder.io.",
    });
  }

  return page;
};

// Define and render the page.
export default function Builders() {
  // Use the useLoaderData hook to get the Page data from `loader` above.
  const page = useLoaderData();

  // Render the page content from Builder.io
  return <BuilderComponent model="page" content={page} />;
}
