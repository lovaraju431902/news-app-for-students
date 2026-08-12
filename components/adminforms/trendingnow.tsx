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
    getDefaultISODate,
    formatDateStringToReadable,
} from "./form-helpers";

export const TrendingNowSchema = z.object({
    title: z.string().min(3, "Title is required"),
    image: z.string().min(1, "Image is required"),
    date: z.string().min(1, "Date is required"),
    href: z.string().min(1, "Href is required"),
    isActive: z.boolean(),
});

export type TrendingFormValues = z.infer<typeof TrendingNowSchema>;

export default function TrendingnewsForm() {
    const queryClient = useQueryClient();
    const [loading, setLoading] = useState(false);

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors },
    } = useForm<TrendingFormValues>({
        resolver: zodResolver(TrendingNowSchema),
        defaultValues: {
            title: "",
            image: "",
            date: getDefaultISODate(),
            href: "",
            isActive: false,
        },
    });

    const isActive = watch("isActive");

    const createTrendingNews = async (data: TrendingFormValues) => {
        const payload = {
            ...data,
            date: formatDateStringToReadable(data.date),
        };

        const response = await fetch("/api/trendingnews", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            throw new Error("Failed to create Trending News");
        }

        return response.json();
    };

    const mutation = useMutation({
        mutationFn: createTrendingNews,
        onSuccess: (data) => {
            queryClient.invalidateQueries();
            alert("Trending News created successfully");
        },
        onError: (error) => {
            console.error(error);
            alert("Failed to create Trending News");
        },
    });

    const onSubmit = async (values: TrendingFormValues) => {
        mutation.mutate(values);
    };

    return (
        <Card className="max-w-3xl">
            <CardHeader>
                <CardTitle>Create Trending News</CardTitle>
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
                            placeholder="Trending News Headline"
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
                            label="IMAGE (.WEBP)"
                            type="image"
                            value={watch("image")}
                            onChange={(url) => setValue("image", url, { shouldValidate: true })}
                            placeholder="Click or drag image (Auto-converted to .WebP)"
                            helperText="Images are automatically converted to .WebP."
                        />
                        {errors.image && (
                            <p className="text-sm text-red-500">
                                {errors.image.message}
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

                    {/* Link */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium">
                            Link
                        </label>
                        <Input
                            placeholder="/news/trending"
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
                                Active Item
                            </p>
                            <p className="text-sm text-muted-foreground">
                                Show this trending news item on homepage
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
                        {mutation.isPending ? "Creating..." : "Create Trending News"}
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
}