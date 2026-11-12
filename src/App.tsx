import { useEffect, useState } from "react";
import Admin from "./admin";
import Storefront from "./storefront";
export default function App() {
  const [route, setRoute] = useState(location.pathname + location.search);
  useEffect(() => {
    const listener = () => setRoute(location.pathname + location.search);
    addEventListener("popstate", listener);
    return () => removeEventListener("popstate", listener);
  }, []);
  return location.pathname.startsWith("/admin") ? (
    <Admin path={location.pathname} />
  ) : (
    <Storefront
      key={route.startsWith("/demo") ? "demo" : "live"}
      route={route}
    />
  );
}
