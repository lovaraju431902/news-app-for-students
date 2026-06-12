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
import { useMutation } from "@tanstack/react-query";

export const YouMayLikeSchema = z.object({
    headline: z.string().min(3, "Headline is required"),
    description: z.string().min(3, "Description is required"),
    image: z.string().url("Enter a valid image URL"),
    href: z.string().min(1, "Link is required"),
    isActive: z.boolean(),
});

export type YouMayLikeFormValues = z.infer<typeof YouMayLikeSchema>;

export default function YouMayLikeForm() {
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
        onSuccess: () => {
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
                <CardTitle>Create Sponsored Link (You May Like)</CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                    {/* Headline */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Headline</label>
                        <Input
                            placeholder="Option Trading Mastery: Learn गोपाल Sir's Strategy"
                            {...register("headline")}
                        />
                        {errors.headline && (
                            <p className="text-sm text-red-500">{errors.headline.message}</p>
                        )}
                    </div>

                    {/* Description */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Description</label>
                        <Input
                            placeholder="Master the Art of Option Trading with Gopal Sir's strategy for free!"
                            {...register("description")}
                        />
                        {errors.description && (
                            <p className="text-sm text-red-500">{errors.description.message}</p>
                        )}
                    </div>

                    {/* Image URL */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Image URL</label>
                        <Input
                            placeholder="https://example.com/ad-image.jpg"
                            {...register("image")}
                        />
                        {errors.image && (
                            <p className="text-sm text-red-550">{errors.image.message}</p>
                        )}
                    </div>



                    {/* Link */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Destination URL / Link</label>
                        <Input
                            placeholder="https://example.com/landing-page"
                            {...register("href")}
                        />
                        {errors.href && (
                            <p className="text-sm text-red-500">{errors.href.message}</p>
                        )}
                    </div>

                    {/* Active Switch */}
                    <div className="flex items-center justify-between rounded-lg border p-4">
                        <div>
                            <p className="font-medium">Active Sponsored Link</p>
                            <p className="text-sm text-muted-foreground">
                                Show this sponsored link on homepage
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
                        {mutation.isPending ? "Creating Sponsored Link..." : "Create Sponsored Link"}
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
}
