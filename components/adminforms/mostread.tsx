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

export const MostReadSchema = z.object({
    title: z.string().min(3, "Title is required"),
    image: z.string().min(1, "Image is required"),
    href: z.string().min(1, "Link is required"),
    isActive: z.boolean(),
});

export type MostReadFormValues = z.infer<typeof MostReadSchema>;

export default function MostReadForm() {
    const queryClient = useQueryClient();
    const [loading, setLoading] = useState(false);

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors },
    } = useForm<MostReadFormValues>({
        resolver: zodResolver(MostReadSchema),
        defaultValues: {
            title: "",
            image: "",
            href: "",
            isActive: false,
        },
    });

    const isActive = watch("isActive");

    const createMostRead = async (data: MostReadFormValues) => {
        const response = await fetch("/api/mostread", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            throw new Error("Failed to create Most Read item");
        }

        return response.json();
    };

    const mutation = useMutation({
        mutationFn: createMostRead,
        onSuccess: (data) => {
            queryClient.invalidateQueries();
            alert("Most Read item created successfully");
        },
        onError: (error) => {
            console.error(error);
            alert("Failed to create Most Read item");
        },
    });

    const onSubmit = async (values: MostReadFormValues) => {
        mutation.mutate(values);
    };

    return (
        <Card className="max-w-3xl">
            <CardHeader>
                <CardTitle>Create Most Read Item</CardTitle>
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
                            placeholder="Most Read Article Headline"
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

                    {/* Link */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium">
                            Link
                        </label>
                        <Input
                            placeholder="/news/most-read"
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
                                Show this item in Most Read on homepage
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
                        {mutation.isPending ? "Creating..." : "Create Most Read Item"}
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
}
