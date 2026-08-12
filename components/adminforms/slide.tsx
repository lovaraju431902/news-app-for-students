"use client";

import { useState, useEffect } from "react";
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
import {
    MAIN_10_COLORS,
    getRandomReadTime,
    getDefaultISODate,
    formatDateStringToReadable,
    DEFAULT_AUTHOR,
    getRandomBadgeColor,
} from "./form-helpers";

export const SlideSchema = z.object({
    title: z.string().min(3, "Title is required"),
    image: z.string().min(1, "Image is required"),
    readTime: z.string().min(1, "Read time is required"),
    date: z.string().min(1, "Date is required"),
    author: z.string().min(2, "Author is required"),
    href: z.string().min(1, "Href is required"),
    badge: z.object({
        label: z.string().min(1, "Badge label is required"),
        color: z.string().min(1, "Badge color is required"),
    }),
    isActive: z.boolean(),
});

export type SlideFormValues = z.infer<typeof SlideSchema>;

export default function SlideForm() {
    const queryClient = useQueryClient();
    const [loading, setLoading] = useState(false);

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors },
    } = useForm<SlideFormValues>({
        resolver: zodResolver(SlideSchema),
        defaultValues: {
            title: "",
            image: "",
            readTime: getRandomReadTime(),
            date: getDefaultISODate(),
            author: DEFAULT_AUTHOR,
            href: "",
            badge: {
                label: "",
                color: getRandomBadgeColor(),
            },
            isActive: false,
        },
    });

    const isActive = watch("isActive");
    const currentColor = watch("badge.color");

    const createSlide = async (data: SlideFormValues) => {
        const payload = {
            ...data,
            date: formatDateStringToReadable(data.date),
        };

        const response = await fetch("/api/slidedata", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            throw new Error("Failed to create slide");
        }

        return response.json();
    };

    const mutation = useMutation({
        mutationFn: createSlide,
        onSuccess: (data) => {
            queryClient.invalidateQueries();
            alert("Slide created successfully");
        },
        onError: (error) => {
            console.error(error);
            alert("Failed to create slide");
        },
    });

    const onSubmit = async (values: SlideFormValues) => {
        mutation.mutate(values);
    };

    return (
        <Card className="max-w-3xl">
            <CardHeader>
                <CardTitle>Create Slide</CardTitle>
            </CardHeader>

            <CardContent>
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="space-y-6"
                >
                    {/* Title */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium">
                            Title
                        </label>
                        <Input
                            placeholder="Latest Government Jobs"
                            {...register("title")}
                        />
                        {errors.title && (
                            <p className="text-sm text-red-500">
                                {errors.title.message}
                            </p>
                        )}
                    </div>

                    {/* Image / Thumbnail File Picker */}
                    <div className="space-y-2">
                        <MediaPicker
                            label="SLIDE COVER IMAGE (.WEBP)"
                            type="image"
                            value={watch("image")}
                            onChange={(url) => setValue("image", url, { shouldValidate: true })}
                            placeholder="Click or drag slide cover image (Auto-converted to .WebP)"
                            helperText="Images are automatically converted to .WebP for fast and lazy loading."
                        />
                        {errors.image && (
                            <p className="text-sm text-red-500">
                                {errors.image.message}
                            </p>
                        )}
                    </div>

                    {/* Read Time (Random Default 2-10 mins) */}
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <label className="text-sm font-medium">
                                Read Time
                            </label>
                            <button
                                type="button"
                                onClick={() => setValue("readTime", getRandomReadTime())}
                                className="text-xs text-blue-600 hover:underline"
                            >
                                🎲 Randomize
                            </button>
                        </div>
                        <Input
                            placeholder="5 min read"
                            {...register("readTime")}
                        />
                        {errors.readTime && (
                            <p className="text-sm text-red-500">
                                {errors.readTime.message}
                            </p>
                        )}
                    </div>

                    {/* Date Picker */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium">
                            Date Picker
                        </label>
                        <Input
                            type="date"
                            {...register("date")}
                        />
                        {errors.date && (
                            <p className="text-sm text-red-500">
                                {errors.date.message}
                            </p>
                        )}
                    </div>

                    {/* Author (Default Admin) */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium">
                            Author
                        </label>
                        <Input
                            placeholder="Admin"
                            {...register("author")}
                        />
                        {errors.author && (
                            <p className="text-sm text-red-500">
                                {errors.author.message}
                            </p>
                        )}
                    </div>

                    {/* Link */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium">
                            Link
                        </label>
                        <Input
                            placeholder="/jobs/latest"
                            {...register("href")}
                        />
                        {errors.href && (
                            <p className="text-sm text-red-500">
                                {errors.href.message}
                            </p>
                        )}
                    </div>

                    {/* Badge Label */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium">
                            Badge Label
                        </label>
                        <Input
                            placeholder="Jobs"
                            {...register("badge.label")}
                        />
                        {errors.badge?.label && (
                            <p className="text-sm text-red-500">
                                {errors.badge.label.message}
                            </p>
                        )}
                    </div>

                    {/* Badge Color (10 Main Colors Selection) */}
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <label className="text-sm font-medium">
                                Badge Color
                            </label>
                            <button
                                type="button"
                                onClick={() => setValue("badge.color", getRandomBadgeColor())}
                                className="text-xs text-blue-600 hover:underline"
                            >
                                🎲 Random Color
                            </button>
                        </div>
                        <div className="flex flex-wrap gap-2 pt-1">
                            {MAIN_10_COLORS.map((c) => (
                                <button
                                    key={c.name}
                                    type="button"
                                    onClick={() => setValue("badge.color", c.value, { shouldValidate: true })}
                                    className={`px-2.5 py-1 rounded-md text-xs font-semibold cursor-pointer border transition-all ${c.value} ${
                                        currentColor === c.value
                                            ? "ring-2 ring-blue-500 scale-105 shadow-xs font-bold"
                                            : "opacity-80 hover:opacity-100"
                                    }`}
                                >
                                    {c.name}
                                </button>
                            ))}
                        </div>
                        <Input
                            placeholder="e.g. bg-blue-100 text-blue-600"
                            {...register("badge.color")}
                            className="mt-1"
                        />
                        {errors.badge?.color && (
                            <p className="text-sm text-red-500">
                                {errors.badge.color.message}
                            </p>
                        )}
                    </div>

                    {/* Active Switch */}
                    <div className="flex items-center justify-between rounded-lg border p-4">
                        <div>
                            <p className="font-medium">
                                Active Slide
                            </p>
                            <p className="text-sm text-muted-foreground">
                                Show this slide on homepage
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
                        {mutation.isPending ? "Creating..." : "Create Slide"}
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
}