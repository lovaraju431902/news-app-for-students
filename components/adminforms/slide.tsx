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

export const SlideSchema = z.object({
    title: z.string().min(3, "Title is required"),

    image: z.string().url("Enter a valid image URL"),

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
            readTime: "",
            date: "",
            author: "",
            href: "",
            badge: {
                label: "",
                color: "",
            },
            isActive: false,
        },
    });

    const isActive = watch("isActive");










    const createSlide = async (
        data: SlideFormValues
    ) => {
        const response = await fetch("/api/slidedata", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            throw new Error("Failed to create slide");
        }

        return response.json();
    };




    const mutation = useMutation({
        mutationFn: createSlide,

        onSuccess: (data) => {
            console.log(data);
            queryClient.invalidateQueries();
            alert("Slide created successfully");
        },

        onError: (error) => {
            console.error(error);
            alert("Failed to create slide");
        },
    });





    const onSubmit = async (
        values: SlideFormValues
    ) => {
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
                    className="space-y-5"
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

                    {/* Image */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium">
                            Image URL
                        </label>

                        <Input
                            placeholder="https://example.com/image.jpg"
                            {...register("image")}
                        />

                        {errors.image && (
                            <p className="text-sm text-red-500">
                                {errors.image.message}
                            </p>
                        )}
                    </div>

                    {/* Read Time */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium">
                            Read Time
                        </label>

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

                    {/* Date */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium">
                            Date
                        </label>

                        <Input
                            placeholder="Jun 10, 2026"
                            {...register("date")}
                        />

                        {errors.date && (
                            <p className="text-sm text-red-500">
                                {errors.date.message}
                            </p>
                        )}
                    </div>

                    {/* Author */}
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

                    {/* Badge Color */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium">
                            Badge Color
                        </label>

                        <Input
                            placeholder="green"
                            {...register("badge.color")}
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
                        {mutation.isPending ? "Creating Slide..." : "Create Slide"}
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
}