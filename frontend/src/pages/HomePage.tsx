import { Navigate } from "react-router-dom";

export default function HomePage() {
  return (
    <>
      <Navigate replace to="/portfolio" />
    </>
  );
}
