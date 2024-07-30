import React, { createContext, useContext, useState, useEffect } from "react";
import supabase from "components/supabaseClient";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // 사용자 세션을 가져오기
    const fetchSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      console.log("Fetched session:", session); // 세션 정보 콘솔에 출력
      setUser(session?.user ?? null);
    };

    fetchSession();

    // 인증 상태 변경 리스너 설정
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_, session) => {
        console.log("Auth state changed:", session); // 인증 상태 변경 로그 출력
        setUser(session?.user ?? null);
      }
    );

    // 컴포넌트 언마운트 시 리스너 해제
    return () => {
      // 구독 해제 코드가 필요 없으면 삭제하거나 주석 처리할 수 있습니다.
      // 기본적으로 onAuthStateChange는 내부에서 클린업을 처리합니다.
      // authListener?.unsubscribe(); // 여기에 실제 구독 해제 코드를 넣을 수 있습니다.
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user }}>{children}</AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
