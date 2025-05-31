import Image from "next/image";
import Navbar from "./Components/Home/Navbar";
import ProductList from "./Components/Home/Products";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Home() {
  return (
    <div>
      <Navbar />
      <ProductList />
      <ToastContainer position="top-center" autoClose={3000} />
    </div>
  );
}