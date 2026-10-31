import Sidebar from "./Homescreen";
import Header from "./Homescreen/header";
import MostRead from "./Homescreen/mostread";
import Footer from "./Homescreen/footer";
import Navbar from "./Homescreen/Navbar";
import Categoryrow from "./Homescreen/nextsection";
import Topbar from "./Homescreen/topbar";

export default function MainPage() {

    return (

        <div className="hide-scrollbar">
            <Topbar />
            <Header />
            <Navbar />
            <Sidebar />
            <MostRead />
            <Footer />

        </div>
    )
}



