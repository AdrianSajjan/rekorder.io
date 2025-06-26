export interface ApiOptions extends RequestInit {
  multipart?: boolean;
}

export async function api(input: RequestInfo | URL, options?: ApiOptions) {
  // const accessToken = extractAuthentication().accessToken;
  // const auth = "Bearer " + accessToken;

  // await mutex.waitForUnlock();
  const response = await fetch(input, {
    ...options,
    headers: {
      ...options?.headers,
      ...(options?.multipart ? {} : { 'Content-Type': 'application/json' }),
      // ...(accessToken ? { Authorization: auth } : {}),
    },
  });

  // if (response.status === 401) {
  //   const refreshToken = extractAuthentication().refreshToken;
  //   const retry = metadata?.retry ?? false;

  //   if (retry || !refreshToken) {
  //     handleLogout();
  //     return response;
  //   }

  //   if (!mutex.isLocked()) {
  //     const release = await mutex.acquire();

  //     try {
  //       const oauth = await fetch(mBaseURL + "/api/auth/token/refresh", {
  //         method: "POST",
  //         body: JSON.stringify({ refresh_token: refreshToken }),
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //       });

  //       const json = await oauth.json();
  //       const parsed = APIResponseSuccessSchema.extend({ data: AuthenticationSchema }).safeParse(json);

  //       if (!oauth.ok || !parsed.success) {
  //         release();
  //         handleLogout();
  //       } else {
  //         persistAuthentication(parsed.data.data);
  //         release();
  //         response = await api(input, options, { ...(metadata || {}), retry: true });
  //       }
  //     } catch {
  //       release();
  //       handleLogout();
  //     }
  //   } else {
  //     await mutex.waitForUnlock();
  //     response = await api(input, options, { ...(metadata || {}), retry: true });
  //   }
  // }

  return response;
}
