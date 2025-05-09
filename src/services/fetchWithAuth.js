export async function fetchWithAuth(url, options = {}) {
    let token = localStorage.getItem("access");
  
    let res = await fetch(url, {
      ...options,
      headers: {
        ...(options.headers || {}),
        Authorization: `Bearer ${token}`,
      },
    });
  
    // If access token expired
    if (res.status === 401) {
      const refreshToken = localStorage.getItem("refresh");
      if (refreshToken) {
        const refreshRes = await fetch("http://localhost:8000/api/token/refresh/", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ refresh: refreshToken }),
        });
  
        if (refreshRes.ok) {
          const data = await refreshRes.json();
          localStorage.setItem("access", data.access);
          token = data.access;
  
          // Retry original request with new token
          res = await fetch(url, {
            ...options,
            headers: {
              ...(options.headers || {}),
              Authorization: `Bearer ${token}`,
            },
          });
        } else {
          // Refresh token expired or invalid
          handleLogout();
          return new Response(null, { status: 401 });
        }
      } else {
        // No refresh token found
        handleLogout();
        return new Response(null, { status: 401 });
      }
    }
  
    return res;
  }
  
  // Helper: redirect and clean up
  function handleLogout() {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    window.location.href = "/";
  }
  