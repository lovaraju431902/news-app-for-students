import Sidebar from "./Homescreen";
import Header from "./Homescreen/header";
import MostRead from "./Homescreen/mostread";
import VideoGallery from "./Homescreen/videogallery";
import YouMayLike from "./Homescreen/youmaylike";
import Footer from "./Homescreen/footer";
import Navbar from "./Homescreen/Navbar";
import Categoryrow from "./Homescreen/nextsection";
import Topbar from "./Homescreen/topbar";

export default function MainPage() {

    return (

        <div>
            <Topbar />
            <Header />
            <Navbar />
            <Sidebar />
            <MostRead />
            <VideoGallery />
            <YouMayLike />
            <Footer />

        </div>
    )
}



