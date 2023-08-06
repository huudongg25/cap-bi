import Head from "next/head";
import styles from "@/styles/Home.module.css";
import cn from "classnames";
import Register from "@/components/register/register";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Loading from "@/components/loadingComponent";
import Link from "next/link";
import NewLayout from "../../NewLayout";

function DangKi() {
  const [loading, setLoading] = useState(true);
  const [roleId, setRoleId] = useState();
  let router = useRouter();

  useEffect(() => {
    setRoleId(localStorage.getItem("roleId"));
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/dang-nhap");
    } else {
      setLoading(false);
    }
  }, []);

  return (
    <>
      <Head>
        <title>Tạo tài khoản mới</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon-logo.png" />
      </Head>
      <main className={cn(styles.main)}>
        {loading && <Loading />}
        {roleId === "6" && (
          <NewLayout>
            <Register />
          </NewLayout>
        )}
        {roleId !== "6" && (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "column-reverse",
              padding: "20px 0",
            }}
          >
            <img style={{ width: 500 }} src="/403-blacasa.png" alt="" />
            <p>
              Bạn không có quyền truy cập.
              <Link
                style={{
                  marginLeft: 4,
                  fontWeight: 600,
                  textDecoration: "underline",
                }}
                href="/home"
              >
                Quay lại trang chủ !
              </Link>
            </p>
          </div>
        )}
      </main>
    </>
  );
}

export default DangKi;
