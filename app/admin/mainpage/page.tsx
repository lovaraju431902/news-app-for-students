import LatestNewsForm from "@/components/adminforms/latestnews";
import RightCardForm from "@/components/adminforms/rightcard";
import SlideForm from "@/components/adminforms/slide";
import PopularTopicsForm from "@/components/adminforms/populartopics";
import StudyMaterialForm from "@/components/adminforms/studymaterial";
import TechnologyNewsForm from "@/components/adminforms/technologynews";
import TrendingnewsForm from "@/components/adminforms/trendingnow";
import WebStoryForm from "@/components/adminforms/webstories";
import VideoForm from "@/components/adminforms/videos";
import MostReadForm from "@/components/adminforms/mostread";
import VideoGalleryForm from "@/components/adminforms/videogallery";
import YouMayLikeForm from "@/components/adminforms/youmaylike";

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs"

export default function Page() {
    return (
        <div className="min-h-screen bg-zinc-50/50 p-6 md:p-10 w-full">
            <div className="max-full mx-auto space-y-8">
                <div>
                    <h1 className="text-3xl font-black tracking-tight text-zinc-900">Admin Content Manager</h1>
                    <p className="text-sm text-zinc-500 mt-1">Configure and manage homepage sections, sliders, grids and stories dynamically.</p>
                </div>

                <Tabs defaultValue="slidedata" className="w-full">
                    <TabsList className="flex flex-wrap gap-1.5 h-auto bg-zinc-100 p-1.5 rounded-xl border border-zinc-200/50 w-full justify-start md:inline-flex mb-8">
                        <TabsTrigger value="slidedata" className="rounded-lg text-xs font-semibold px-3.5 py-2">Slide Data</TabsTrigger>
                        <TabsTrigger value="rightcards" className="rounded-lg text-xs font-semibold px-3.5 py-2">Right Cards</TabsTrigger>
                        <TabsTrigger value="latestnews" className="rounded-lg text-xs font-semibold px-3.5 py-2">Latest News</TabsTrigger>
                        <TabsTrigger value="populartopics" className="rounded-lg text-xs font-semibold px-3.5 py-2">Popular Topics</TabsTrigger>
                        <TabsTrigger value="studymaterial" className="rounded-lg text-xs font-semibold px-3.5 py-2">Study Material</TabsTrigger>
                        <TabsTrigger value="technologynews" className="rounded-lg text-xs font-semibold px-3.5 py-2">Technology News</TabsTrigger>
                        <TabsTrigger value="trendingnews" className="rounded-lg text-xs font-semibold px-3.5 py-2">Trending News</TabsTrigger>
                        <TabsTrigger value="webstories" className="rounded-lg text-xs font-semibold px-3.5 py-2">Web Stories</TabsTrigger>
                        <TabsTrigger value="videos" className="rounded-lg text-xs font-semibold px-3.5 py-2">Videos</TabsTrigger>
                        <TabsTrigger value="mostread" className="rounded-lg text-xs font-semibold px-3.5 py-2">Most Read</TabsTrigger>
                        <TabsTrigger value="videogallery" className="rounded-lg text-xs font-semibold px-3.5 py-2">Video Gallery</TabsTrigger>
                        <TabsTrigger value="youmaylike" className="rounded-lg text-xs font-semibold px-3.5 py-2">You May Like</TabsTrigger>

                    </TabsList>

                    <div className="mt-4 bg-white rounded-2xl border border-zinc-200/60 shadow-sm p-6 max-w-4xl">
                        <TabsContent value="slidedata" className="mt-0 focus-visible:ring-0 focus-visible:ring-offset-0">
                            <SlideForm />
                        </TabsContent>
                        <TabsContent value="rightcards" className="mt-0 focus-visible:ring-0 focus-visible:ring-offset-0">
                            <RightCardForm />
                        </TabsContent>
                        <TabsContent value="latestnews" className="mt-0 focus-visible:ring-0 focus-visible:ring-offset-0">
                            <LatestNewsForm />
                        </TabsContent>
                        <TabsContent value="populartopics" className="mt-0 focus-visible:ring-0 focus-visible:ring-offset-0">
                            <PopularTopicsForm />
                        </TabsContent>
                        <TabsContent value="studymaterial" className="mt-0 focus-visible:ring-0 focus-visible:ring-offset-0">
                            <StudyMaterialForm />
                        </TabsContent>
                        <TabsContent value="technologynews" className="mt-0 focus-visible:ring-0 focus-visible:ring-offset-0">
                            <TechnologyNewsForm />
                        </TabsContent>
                        <TabsContent value="trendingnews" className="mt-0 focus-visible:ring-0 focus-visible:ring-offset-0">
                            <TrendingnewsForm />
                        </TabsContent>
                        <TabsContent value="webstories" className="mt-0 focus-visible:ring-0 focus-visible:ring-offset-0">
                            <WebStoryForm />
                        </TabsContent>
                        <TabsContent value="videos" className="mt-0 focus-visible:ring-0 focus-visible:ring-offset-0">
                            <VideoForm />
                        </TabsContent>
                        <TabsContent value="mostread" className="mt-0 focus-visible:ring-0 focus-visible:ring-offset-0">
                            <MostReadForm />
                        </TabsContent>
                        <TabsContent value="videogallery" className="mt-0 focus-visible:ring-0 focus-visible:ring-offset-0">
                            <VideoGalleryForm />
                        </TabsContent>
                        <TabsContent value="youmaylike" className="mt-0 focus-visible:ring-0 focus-visible:ring-offset-0">
                            <YouMayLikeForm />
                        </TabsContent>

                    </div>
                </Tabs>
            </div>
        </div>
    )
}
