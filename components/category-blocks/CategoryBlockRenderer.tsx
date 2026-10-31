"use client";

import React from "react";
import { CategoryBlockData } from "@/lib/category-service";
import { Style1FeaturedList } from "./Style1FeaturedList";
import { Style2FeaturedGridList } from "./Style2FeaturedGridList";
import { Style3TwoRowGrid } from "./Style3TwoRowGrid";
import { Style4FourColumnGrid } from "./Style4FourColumnGrid";
import { Style5Slider } from "./Style5Slider";
import { Style6DarkBlock } from "./Style6DarkBlock";

interface CategoryBlockRendererProps {
  data: CategoryBlockData;
}

export function CategoryBlockRenderer({ data }: CategoryBlockRendererProps) {
  if (!data || !data.posts || data.posts.length === 0) {
    return null;
  }

  const style = data.category.homepageBlockStyle || "style1";

  switch (style) {
    case "style1":
      return <Style1FeaturedList data={data} />;
    case "style2":
      return <Style2FeaturedGridList data={data} />;
    case "style3":
      return <Style3TwoRowGrid data={data} />;
    case "style4":
      return <Style4FourColumnGrid data={data} />;
    case "style5":
      return <Style5Slider data={data} />;
    case "style6":
      return <Style6DarkBlock data={data} />;
    default:
      return <Style1FeaturedList data={data} />;
  }
}
