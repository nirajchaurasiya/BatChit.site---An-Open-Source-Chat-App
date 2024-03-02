import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Layout from "./Layout/Layout";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "./types/Rootstate";
import { login } from "./features/auth/authSlice";
import { getCookie } from "./utils/getCookies";
import AuthLayout from "./components/AuthLayout";
import Spinner from "./components/Spinner";
import PageNotFound from "./components/PageNotFound";
import { Dispatch } from "@reduxjs/toolkit";
export default function App() {
  const [socket, setSocket] = useState<Socket | null>(null);
  const REACT_APP_BACKEND_URL = import.meta.env.VITE_REACT_APP_BACKEND_URL;
  const [loader, setLoader] = useState(true);
  const loggedInUser = useSelector(
    (state: RootState) => state.auth.loggedInUser
  );
  const accessToken: string | null = getCookie("accessToken");
  const dispatch = useDispatch<Dispatch>();
  useEffect(() => {
    setSocket(
      io(REACT_APP_BACKEND_URL, {
        withCredentials: true,
      })
    );
  }, []);

  useEffect(() => {
    socket?.emit("add-user");
  }, [socket]);

  useEffect(() => {
    const fetchUser = async () => {
      if (accessToken && typeof accessToken === "string") {
        dispatch(login(accessToken));
      }
      setTimeout(() => {
        setLoader(false);
      }, 2000);
    };
    fetchUser();
  }, []);
  // const emitChatMsg = () => {
  //   if (socket) {
  //     socket.emit("chat-message", { userId: "123", username: "example" });
  //   }
  // };
  if (accessToken) {
    if (loader) return <Spinner />;
  }
  return (
    <BrowserRouter>
      <main>
        <Routes>
          {/*  Before Authentication */}
          <Route
            path="/auth/register"
            element={
              <section className="register">
                {loader ? (
                  <Spinner />
                ) : (
                  <AuthLayout loggedInUser={loggedInUser} register />
                )}
              </section>
            }
          />
          <Route
            path="/auth/login"
            element={
              <section className="register">
                {loader ? (
                  <Spinner />
                ) : (
                  <AuthLayout loggedInUser={loggedInUser} login />
                )}
              </section>
            }
          />

          {/* After authentication */}
          <Route
            path="/"
            element={
              <section className="layout">
                <Layout home={true} />
              </section>
            }
          />

          <Route
            path="/search"
            element={
              <section className="layout">
                <Layout search={true} />
              </section>
            }
          />

          <Route
            path="/group-messages"
            element={
              <section className="layout">
                <Layout groupMessages={true} />
              </section>
            }
          />

          <Route
            path="/group-messages/:groupId"
            element={
              <section className="layout">
                <Layout groupMessages={true} isGroup />
              </section>
            }
          />
          <Route
            path="/user-history"
            element={
              <section className="layout">
                <Layout history={true} />
              </section>
            }
          />
          <Route
            path="/profile"
            element={
              <section className="layout">
                <Layout profile={true} />
              </section>
            }
          />
          {/*  */}

          <Route
            path="/profile/user-information"
            element={
              <section className="layout">
                <Layout profile={true} userInformation />
              </section>
            }
          />

          <Route
            path="/profile/blocked-accounts"
            element={
              <section className="layout">
                <Layout profile={true} blockedAccounts />
              </section>
            }
          />

          <Route
            path="/profile/delete-account"
            element={
              <section className="layout">
                <Layout profile={true} deleteAccount />
              </section>
            }
          />

          {/*  */}
          <Route
            path="/logout"
            element={
              <section className="layout">
                <Layout logout={true} />
              </section>
            }
          />
          <Route
            path="/messages/:userId"
            element={
              <section className="layout">
                <Layout message={true} />
              </section>
            }
          />
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}
