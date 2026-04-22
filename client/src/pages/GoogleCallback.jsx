import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { checkAuth } from "../redux/slices/authSlice";

const GoogleCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const token = searchParams.get("token");
    if (token) {
      dispatch(checkAuth())
        .unwrap()
        .then(() => {
          navigate("/dashboard");
        })
        .catch(() => {
          navigate("/login");
        });
    } else {
      navigate("/login");
    }
  }, [searchParams, navigate, dispatch]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      <div className="relative">
        <div className="animate-spin rounded-full h-24 w-24 border-t-4 border-b-4 border-blue-600"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
           <div className="w-12 h-12 bg-blue-600/10 rounded-full"></div>
        </div>
      </div>
      <h2 className="mt-8 text-xl font-black text-slate-900 dark:text-white uppercase tracking-widest animate-pulse">
        Authenticating...
      </h2>
      <p className="mt-2 text-slate-500 dark:text-slate-400 font-bold uppercase tracking-tight text-xs">
        Securely logging you in with Google
      </p>
    </div>
  );
};

export default GoogleCallback;
