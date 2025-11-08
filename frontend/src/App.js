import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import BookList from "./pages/book/BookList";
import BookLessonDetail from "./pages/book/components/BookLessonDetail/BookLessonDetail";
import SlideDesigner from "./pages/Editor/components/SlideDesigner/SlideDesigner";
import EditorPage from "./pages/Editor/EditorPage";
import Layout from "./pages/layout/Layout";
import ReelDetails from "./pages/lesson/components/ ReelDetails/ReelDetails";
import CardDetails from "./pages/lesson/components/CardDetail/CardDetail";
import CreateLesson from "./pages/lesson/components/CreateLessonCard/CreateLesson";
import SlideDetails from "./pages/lesson/components/SlideDetails/SlideDetails";
import LessonList from "./pages/lesson/LessonList";
import Index from "./pages/LessonIndexDetail/Index";

const AppRouter = () => (
  <BrowserRouter>
    <Routes>
      {/* <Route path="/" element={<CourseList />} /> */}

      <Route path="/books" element={<BookList />} />
      <Route path="/courses/:courseId/lessons" element={<LessonList />} />
      <Route path="/books/:bookId/lessons/create" element={<CreateLesson />} />
      <Route path="/lessons/:lessonId/editor" element={<EditorPage />} />
      <Route path="/lesson-index/:id" element={<Index />} />

      <Route path="/slide/:id/editor/" element={<SlideDesigner />} />



      {/* 
      <Route path="/curriculum" element={<CurriculumManager />} />
      <Route path="/curriculum/:lessonId" element={<CurriculumManager />} /> */}

      <Route path="/books/lesson/:lessonId" element={<BookLessonDetail />} />


      {/* <Route path="/books/:bookId/parts/:partId/lessons/:lessonId" element={<BookLessonDetail />} /> */}

      <Route path="/lessons/:lessonId/cards" element={<CardDetails />} />
      <Route path="/lessons/:lessonId/slides" element={<SlideDetails />} />
      <Route path="/lessons/:lessonId/reels" element={<ReelDetails />} />

      <Route path="/" element={<Layout />} />

    </Routes>
  </BrowserRouter>
);

export default AppRouter;