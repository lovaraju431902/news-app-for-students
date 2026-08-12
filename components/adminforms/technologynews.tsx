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

export const TechnologySchema = z.object({
    title: z.string().min(3, "Title is required"),
    image: z.string().min(1, "Image is required"),
    href: z.string().min(1, "Href is required"),
    isActive: z.boolean(),
});

export type TechnologyValues = z.infer<typeof TechnologySchema>;

export default function TechnologyNewsForm() {
    const queryClient = useQueryClient();
    const [loading, setLoading] = useState(false);

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors },
    } = useForm<TechnologyValues>({
        resolver: zodResolver(TechnologySchema),
        defaultValues: {
            title: "",
            image: "",
            href: "",
            isActive: false,
        },
    });

    const isActive = watch("isActive");

    const createTechnologyNews = async (data: TechnologyValues) => {
        const response = await fetch("/api/technologynews", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            throw new Error("Failed to create Technology News");
        }

        return response.json();
    };

    const mutation = useMutation({
        mutationFn: createTechnologyNews,
        onSuccess: (data) => {
            queryClient.invalidateQueries();
            alert("Technology news created successfully");
        },
        onError: (error) => {
            console.error(error);
            alert("Failed to create technology news");
        },
    });

    const onSubmit = async (values: TechnologyValues) => {
        mutation.mutate(values);
    };

    return (
        <Card className="max-w-3xl">
            <CardHeader>
                <CardTitle>Create Technology News</CardTitle>
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
                            placeholder="Technology News Title"
                            {...register("title")}
                        />
                        {errors.title && (
                            <p className="text-sm text-red-500">
                                {errors.title.message}
                            </p>
                        )}
                    </div>

                    {/* Image Picker */}
                    <div className="space-y-2">
                        <MediaPicker
                            label="IMAGE (.WEBP)"
                            type="image"
                            value={watch("image")}
                            onChange={(url) => setValue("image", url, { shouldValidate: true })}
                            placeholder="Click or drag technology news image (Auto-converted to .WebP)"
                            helperText="Images are automatically converted to .WebP."
                        />
                        {errors.image && (
                            <p className="text-sm text-red-500">
                                {errors.image.message}
                            </p>
                        )}
                    </div>

                    {/* Link */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium">
                            Link
                        </label>
                        <Input
                            placeholder="/news/tech"
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
                                Show this technology news item on homepage
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
                        {mutation.isPending ? "Creating..." : "Create Technology News"}
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
}