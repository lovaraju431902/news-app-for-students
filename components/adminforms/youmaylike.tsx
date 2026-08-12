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

export const YouMayLikeSchema = z.object({
    headline: z.string().min(3, "Headline is required"),
    description: z.string().min(3, "Description is required"),
    image: z.string().min(1, "Image is required"),
    href: z.string().min(1, "Link is required"),
    isActive: z.boolean(),
});

export type YouMayLikeFormValues = z.infer<typeof YouMayLikeSchema>;

export default function YouMayLikeForm() {
    const queryClient = useQueryClient();
    const [loading, setLoading] = useState(false);

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors },
    } = useForm<YouMayLikeFormValues>({
        resolver: zodResolver(YouMayLikeSchema),
        defaultValues: {
            headline: "",
            description: "",
            image: "",
            href: "",
            isActive: false,
        },
    });

    const isActive = watch("isActive");

    const createYouMayLike = async (data: YouMayLikeFormValues) => {
        const response = await fetch("/api/youmaylike", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            throw new Error("Failed to create You May Like item");
        }

        return response.json();
    };

    const mutation = useMutation({
        mutationFn: createYouMayLike,
        onSuccess: (data) => {
            queryClient.invalidateQueries();
            alert("You May Like item created successfully");
        },
        onError: (error) => {
            console.error(error);
            alert("Failed to create You May Like item");
        },
    });

    const onSubmit = async (values: YouMayLikeFormValues) => {
        mutation.mutate(values);
    };

    return (
        <Card className="max-w-3xl">
            <CardHeader>
                <CardTitle>Create You May Like Item</CardTitle>
            </CardHeader>

            <CardContent>
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="space-y-6"
                >
                    {/* Headline */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium">
                            Headline
                        </label>
                        <Input
                            placeholder="Recommendation Headline"
                            {...register("headline")}
                        />
                        {errors.headline && (
                            <p className="text-sm text-red-500">
                                {errors.headline.message}
                            </p>
                        )}
                    </div>

                    {/* Description */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium">
                            Description
                        </label>
                        <Input
                            placeholder="Short description or tagline"
                            {...register("description")}
                        />
                        {errors.description && (
                            <p className="text-sm text-red-500">
                                {errors.description.message}
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
                            placeholder="/sponsored/link"
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
                                Show this item in You May Like on homepage
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
                        {mutation.isPending ? "Creating..." : "Create You May Like Item"}
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
}
