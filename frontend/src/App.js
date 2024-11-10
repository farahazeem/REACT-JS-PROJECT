import { useEffect, useState } from "react";
import AppRoutes from "./AppRoutes";
import Header from "./components/Header/Header";
import Loading from "./components/Loading/Loading";
import { useLoading } from "./hooks/useLoading";
import { setLoadingInterceptor } from "./interceptors/loadingInterceptor";
import ChatBot from "./components/ChatBot/ChatBot";

function App() {
  const { showLoading, hideLoading } = useLoading();
  const [openChat, setOpenChat] = useState(false);

  useEffect(() => {
    setLoadingInterceptor({ showLoading, hideLoading });
  }, []);

  function closeChat() {
    setOpenChat(false);
  }

  const handleOpen = () => {
    setOpenChat(!openChat);
  };

  return (
    <>
      <Loading />
      <Header />
      <AppRoutes />
      <button class="open-button" onClick={handleOpen}>
        ChatBot
      </button>
      {openChat && (
        <div className="chat-popup">
          <ChatBot closeChat={closeChat} />
        </div>
      )}
    </>
  );
}

export default App;
