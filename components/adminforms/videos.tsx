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

export const VideoSchema = z.object({
    title: z.string().min(3, "Title is required"),
    image: z.string().min(1, "Image / Thumbnail is required"),
    badge: z.string().min(1, "Badge is required"),
    href: z.string().min(1, "Video Link or file URL is required"),
    isActive: z.boolean(),
});

export type VideoFormValues = z.infer<typeof VideoSchema>;

export default function VideoForm() {
    const queryClient = useQueryClient();
    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors },
    } = useForm<VideoFormValues>({
        resolver: zodResolver(VideoSchema),
        defaultValues: {
            title: "",
            image: "",
            badge: "ABN",
            href: "",
            isActive: false,
        },
    });

    const isActive = watch("isActive");

    const createVideo = async (data: VideoFormValues) => {
        const response = await fetch("/api/videos", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            throw new Error("Failed to create Video");
        }

        return response.json();
    };

    const mutation = useMutation({
        mutationFn: createVideo,
        onSuccess: () => {
            queryClient.invalidateQueries();
            alert("Video created successfully");
        },
        onError: (error) => {
            console.error(error);
            alert("Failed to create Video");
        },
    });

    const onSubmit = async (values: VideoFormValues) => {
        mutation.mutate(values);
    };

    return (
        <Card className="max-w-3xl">
            <CardHeader>
                <CardTitle>Create Video</CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    {/* Title */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Title</label>
                        <Input
                            placeholder="Enter Video Title"
                            {...register("title")}
                        />
                        {errors.title && (
                            <p className="text-sm text-red-500">{errors.title.message}</p>
                        )}
                    </div>

                    {/* 1. Thumbnail / Poster Image Picker */}
                    <div className="space-y-2">
                        <MediaPicker
                            label="1. Video Poster / Thumbnail (.WebP)"
                            type="image"
                            value={watch("image")}
                            onChange={(url) => setValue("image", url, { shouldValidate: true })}
                            placeholder="Click or drag video poster (Auto-converted to .WebP)"
                            helperText="High-performance .WebP poster image for instant video preview."
                        />
                        {errors.image && (
                            <p className="text-sm text-red-500">{errors.image.message}</p>
                        )}
                    </div>

                    {/* 2. Video File / Stream Picker */}
                    <div className="space-y-2">
                        <MediaPicker
                            label="2. Video Stream (.WebM / Video File)"
                            type="video"
                            value={watch("href")}
                            onChange={(url) => setValue("href", url, { shouldValidate: true })}
                            placeholder="Click or drag .webm / video file"
                            helperText="Video files are uploaded to Cloudflare and optimized."
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

                    {/* Badge */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Badge (e.g. ABN, Telugu News)</label>
                        <Input
                            placeholder="ABN"
                            {...register("badge")}
                        />
                        {errors.badge && (
                            <p className="text-sm text-red-500">{errors.badge.message}</p>
                        )}
                    </div>

                    {/* Active Switch */}
                    <div className="flex items-center justify-between rounded-lg border p-4">
                        <div>
                            <p className="font-medium">Active Video</p>
                            <p className="text-sm text-muted-foreground">
                                Show this video on the homepage
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
                        {mutation.isPending ? "Creating Video..." : "Create Video"}
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
}
