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

export const WebStorySchema = z.object({
    title: z.string().min(3, "Title is required"),
    image: z.string().min(1, "Thumbnail image is required"),
    video: z.string().min(1, "Video is required"),
    href: z.string().optional(),
    isActive: z.boolean(),
});

export type WebStoryFormValues = z.infer<typeof WebStorySchema>;

export default function WebStoryForm() {
    const queryClient = useQueryClient();
    const [loading, setLoading] = useState(false);

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors },
    } = useForm<WebStoryFormValues>({
        resolver: zodResolver(WebStorySchema),
        defaultValues: {
            title: "",
            image: "",
            video: "",
            href: "",
            isActive: false,
        },
    });

    const isActive = watch("isActive");

    const createWebStory = async (data: WebStoryFormValues) => {
        const response = await fetch("/api/webstories", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            throw new Error("Failed to create Short Video");
        }

        return response.json();
    };

    const mutation = useMutation({
        mutationFn: createWebStory,
        onSuccess: (data) => {
            queryClient.invalidateQueries();
            alert("Short Video created successfully");
        },
        onError: (error) => {
            console.error(error);
            alert("Failed to create Short Video");
        },
    });

    const onSubmit = async (values: WebStoryFormValues) => {
        mutation.mutate(values);
    };

    return (
        <Card className="max-w-3xl">
            <CardHeader>
                <CardTitle>Create Short Video</CardTitle>
            </CardHeader>

            <CardContent>
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="space-y-6"
                >
                    {/* Title */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium">
                            Title / Description
                        </label>
                        <Input
                            placeholder="Short Video Title (Bottom Text overlay)"
                            {...register("title")}
                        />
                        {errors.title && (
                            <p className="text-sm text-red-500">
                                {errors.title.message}
                            </p>
                        )}
                    </div>

                    {/* Image / Thumbnail Picker */}
                    <div className="space-y-2">
                        <MediaPicker
                            label="STORY THUMBNAIL IMAGE (.WEBP)"
                            type="image"
                            value={watch("image")}
                            onChange={(url) => setValue("image", url, { shouldValidate: true })}
                            placeholder="Click or drag story image (Auto-converted to .WebP)"
                            helperText="Images are automatically converted to .WebP."
                        />
                        {errors.image && (
                            <p className="text-sm text-red-500">
                                {errors.image.message}
                            </p>
                        )}
                    </div>

                    {/* Video Picker */}
                    <div className="space-y-2">
                        <MediaPicker
                            label="STORY VIDEO (.MP4 / .WEBM)"
                            type="video"
                            value={watch("video")}
                            onChange={(url) => setValue("video", url, { shouldValidate: true })}
                            placeholder="Click or drag story video file (.mp4 / .webm)"
                            helperText="Videos are stored on cloud/local uploads storage."
                        />
                        {errors.video && (
                            <p className="text-sm text-red-500">
                                {errors.video.message}
                            </p>
                        )}
                    </div>

                    {/* Optional Link */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium">
                            Optional Action Link (Swipe up / Learn More)
                        </label>
                        <Input
                            placeholder="/blogs/some-slug"
                            {...register("href")}
                        />
                        {errors.href && (
                            <p className="text-sm text-red-500">
                                {errors.href.message}
                            </p>
                        )}
                    </div>

                    {/* Active Switch */}
                    <div className="flex items-center justify-between rounded-lg border p-4">
                        <div>
                            <p className="font-medium">
                                Active Short Video
                            </p>
                            <p className="text-sm text-muted-foreground">
                                Show this short video on homepage and video stream feeds
                            </p>
                        </div>

                        <Switch
                            checked={isActive}
                            onCheckedChange={(val) =>
                                setValue("isActive", val)
                            }
                        />
                    </div>

                    {/* Submit Button */}
                    <Button
                        type="submit"
                        disabled={mutation.isPending}
                        className="w-full"
                    >
                        {mutation.isPending ? "Creating..." : "Create Short Video"}
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
}
