// import { NextResponse } from "next/server";

import { auth } from "./app/_lib/auth";

// export function middleware(request) {
//   console.log(request);

//   return NextResponse.redirect(new URL("/about", request.url));
// }

export const middleware = auth; // This will run the auth function on every request to the paths defined in the config below

export const config = {
  matcher: ["/account"],
};
