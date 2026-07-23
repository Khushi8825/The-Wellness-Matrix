import { useContext } from "react";
import { ToastContext } from "../components/Toast";

const useToast = () => useContext(ToastContext);

export default useToast;
