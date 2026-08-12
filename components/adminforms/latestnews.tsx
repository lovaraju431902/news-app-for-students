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
import {
    MAIN_10_COLORS,
    getRandomReadTime,
    getDefaultISODate,
    formatDateStringToReadable,
    getRandomBadgeColor,
} from "./form-helpers";

export const LatestnewsSchema = z.object({
    title: z.string().min(3, "Title is required"),
    image: z.string().min(1, "Image is required"),
    read: z.string().min(1, "Read time is required"),
    date: z.string().min(1, "Date is required"),
    tag: z.string().min(1, "Tag is required"),
    tagColor: z.string().min(1, "Tag color is required"),
    href: z.string().min(1, "Href is required"),
    isActive: z.boolean(),
});

export type LatestnewsFormValues = z.infer<typeof LatestnewsSchema>;

export default function LatestNewsForm() {
    const queryClient = useQueryClient();
    const [loading, setLoading] = useState(false);

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors },
    } = useForm<LatestnewsFormValues>({
        resolver: zodResolver(LatestnewsSchema),
        defaultValues: {
            title: "",
            image: "",
            read: getRandomReadTime(),
            date: getDefaultISODate(),
            href: "",
            tag: "",
            tagColor: getRandomBadgeColor(),
            isActive: false,
        },
    });

    const isActive = watch("isActive");
    const currentTagColor = watch("tagColor");

    const createLatestNews = async (data: LatestnewsFormValues) => {
        const payload = {
            ...data,
            date: formatDateStringToReadable(data.date),
        };

        const response = await fetch("/api/latestnews", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            throw new Error("Failed to create Latest News");
        }

        return response.json();
    };

    const mutation = useMutation({
        mutationFn: createLatestNews,
        onSuccess: (data) => {
            queryClient.invalidateQueries();
            alert("Latest News created successfully");
        },
        onError: (error) => {
            console.error(error);
            alert("Failed to create Latest News");
        },
    });

    const onSubmit = async (values: LatestnewsFormValues) => {
        mutation.mutate(values);
    };

    return (
        <Card className="max-w-3xl">
            <CardHeader>
                <CardTitle>Create Latest News</CardTitle>
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
                            placeholder="Breaking News Headline"
                            {...register("title")}
                        />
                        {errors.title && (
                            <p className="text-sm text-red-500">
                                {errors.title.message}
                            </p>
                        )}
                    </div>

                    {/* Image / Cover Picker */}
                    <div className="space-y-2">
                        <MediaPicker
                            label="COVER IMAGE (.WEBP)"
                            type="image"
                            value={watch("image")}
                            onChange={(url) => setValue("image", url, { shouldValidate: true })}
                            placeholder="Click or drag cover image (Auto-converted to .WebP)"
                            helperText="Images are automatically converted to .WebP."
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
                                onClick={() => setValue("read", getRandomReadTime())}
                                className="text-xs text-blue-600 hover:underline"
                            >
                                🎲 Randomize
                            </button>
                        </div>
                        <Input
                            placeholder="5 min read"
                            {...register("read")}
                        />
                        {errors.read && (
                            <p className="text-sm text-red-500">
                                {errors.read.message}
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

                    {/* Tag */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium">
                            Tag Label
                        </label>
                        <Input
                            placeholder="Education"
                            {...register("tag")}
                        />
                        {errors.tag && (
                            <p className="text-sm text-red-500">
                                {errors.tag.message}
                            </p>
                        )}
                    </div>

                    {/* Tag Color (10 Main Colors Selection) */}
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <label className="text-sm font-medium">
                                Tag Color
                            </label>
                            <button
                                type="button"
                                onClick={() => setValue("tagColor", getRandomBadgeColor())}
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
                                    onClick={() => setValue("tagColor", c.value, { shouldValidate: true })}
                                    className={`px-2.5 py-1 rounded-md text-xs font-semibold cursor-pointer border transition-all ${c.value} ${
                                        currentTagColor === c.value
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
                            {...register("tagColor")}
                            className="mt-1"
                        />
                        {errors.tagColor && (
                            <p className="text-sm text-red-500">
                                {errors.tagColor.message}
                            </p>
                        )}
                    </div>

                    {/* Link */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium">
                            Link
                        </label>
                        <Input
                            placeholder="/news/latest"
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
                                Active News Item
                            </p>
                            <p className="text-sm text-muted-foreground">
                                Show this news item on homepage
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
                        {mutation.isPending ? "Creating..." : "Create Latest News"}
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
}