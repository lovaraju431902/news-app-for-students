"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Switch } from "../ui/switch";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "../ui/card";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { MediaPicker } from "@/components/ui/media-picker";

export const VideoGallerySchema = z.object({
    title: z.string().min(3, "Title is required"),
    image: z.string().min(1, "Image / Thumbnail is required"),
    duration: z.string().min(1, "Duration is required (e.g. 03:02)"),
    category: z.string().min(1, "Category is required (e.g. Cinema, Telugu Video)"),
    href: z.string().min(1, "Link or Video Stream URL is required"),
    isActive: z.boolean(),
});

export type VideoGalleryFormValues = z.infer<typeof VideoGallerySchema>;

export default function VideoGalleryForm() {
    const queryClient = useQueryClient();
    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors },
    } = useForm<VideoGalleryFormValues>({
        resolver: zodResolver(VideoGallerySchema),
        defaultValues: {
            title: "",
            image: "",
            duration: "03:45",
            category: "Telugu News",
            href: "",
            isActive: false,
        },
    });

    const isActive = watch("isActive");

    const createVideoGalleryItem = async (data: VideoGalleryFormValues) => {
        const response = await fetch("/api/videogallery", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            throw new Error("Failed to create Video Gallery item");
        }

        return response.json();
    };

    const mutation = useMutation({
        mutationFn: createVideoGalleryItem,
        onSuccess: () => {
            queryClient.invalidateQueries();
            alert("Video Gallery item created successfully");
        },
        onError: (error) => {
            console.error(error);
            alert("Failed to create Video Gallery item");
        },
    });

    const onSubmit = async (values: VideoGalleryFormValues) => {
        mutation.mutate(values);
    };

    return (
        <Card className="max-w-3xl">
            <CardHeader>
                <CardTitle>Create Video Gallery Item</CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    {/* Title */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Title</label>
                        <Input
                            placeholder="Title must be 20 30 characters"
                            {...register("title")}
                        />
                        {errors.title && (
                            <p className="text-sm text-red-500">{errors.title.message}</p>
                        )}
                    </div>

                    {/* 1. Thumbnail / Poster Image Picker */}
                    <div className="space-y-2">
                        <MediaPicker
                            label="1. Video Thumbnail (.WebP)"
                            type="image"
                            value={watch("image")}
                            onChange={(url) => setValue("image", url, { shouldValidate: true })}
                            placeholder="Click or drag video thumbnail (Auto-converted to .WebP)"
                            helperText="High-performance .WebP thumbnail for gallery display."
                        />
                        {errors.image && (
                            <p className="text-sm text-red-500">{errors.image.message}</p>
                        )}
                    </div>

                    {/* 2. Video Stream / File Picker */}
                    <div className="space-y-2">
                        <MediaPicker
                            label="2. Video Stream (.WebM / Video File)"
                            type="video"
                            value={watch("href")}
                            onChange={(url) => setValue("href", url, { shouldValidate: true })}
                            placeholder="Click or drag .webm / video file"
                            helperText="Video stream file uploaded to Cloudflare."
                        />
                        <Input
                            placeholder="Or enter custom / YouTube / video link (e.g. https://... or /videos/1)"
                            {...register("href")}
                            className="mt-1"
                        />
                        {errors.href && (
                            <p className="text-sm text-red-500">{errors.href.message}</p>
                        )}
                    </div>

                    {/* Duration */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Duration (e.g. 05:30)</label>
                        <Input
                            placeholder="05:30"
                            {...register("duration")}
                        />
                        {errors.duration && (
                            <p className="text-sm text-red-500">{errors.duration.message}</p>
                        )}
                    </div>

                    {/* Category */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Category (e.g. Cinema, Telugu Video, National)</label>
                        <Input
                            placeholder="Telugu Video"
                            {...register("category")}
                        />
                        {errors.category && (
                            <p className="text-sm text-red-500">{errors.category.message}</p>
                        )}
                    </div>

                    {/* Active Switch */}
                    <div className="flex items-center justify-between rounded-lg border p-4">
                        <div>
                            <p className="font-medium">Active Video Gallery Item</p>
                            <p className="text-sm text-muted-foreground">
                                Show this video in the gallery on homepage
                            </p>
                        </div>
                        <Switch
                            checked={isActive}
                            onCheckedChange={(checked: boolean) =>
                                setValue("isActive", checked)
                            }
                        />
                    </div>

                    <Button
                        type="submit"
                        disabled={mutation.isPending}
                        className="w-full"
                    >
                        {mutation.isPending ? "Creating Video Gallery Item..." : "Create Video Gallery Item"}
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
}
