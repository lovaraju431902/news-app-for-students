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

export const LatestnewsSchema = z.object({
    title: z.string().min(3, "Title is required"),

    image: z.string().url("Enter a valid image URL"),

    read: z.string().min(1, "Read time is required"),

    date: z.string().min(1, "Date is required"),
    tag: z.string().min(1, "Tag is required"),
    tagColor: z.string().min(1, "Tag color is required"),



    href: z.string().min(1, "Href is required"),



    isActive: z.boolean(),
});

export type LatestnewsFormValues = z.infer<typeof LatestnewsSchema>;

export default function LatestNewsForm() {
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
            read: "",
            date: "",

            href: "",
            tag: "",
            tagColor: "",
            isActive: false,
        },
    });

    const isActive = watch("isActive");










    const createLatestNews = async (
        data: LatestnewsFormValues
    ) => {
        const response = await fetch("/api/latestnews", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            throw new Error("Failed to create Latest News");
        }

        return response.json();
    };




    const mutation = useMutation({
        mutationFn: createLatestNews,

        onSuccess: (data) => {
            console.log(data);
            alert("Latest news created successfully");
        },

        onError: (error) => {
            console.error(error);
            alert("Failed to create Latest news");
        },
    });





    const onSubmit = async (
        values: LatestnewsFormValues
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
                            {...register("read")}
                        />

                        {errors.read && (
                            <p className="text-sm text-red-500">
                                {errors.read.message}
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

                    <div className="space-y-2">
                        <label className="text-sm font-medium">
                            Tags
                        </label>

                        <Input
                            placeholder="GOVT JOBS, STUDY TIPS,AI TOOLS"
                            {...register("tag")}
                        />

                        {errors.tag && (
                            <p className="text-sm text-red-500">
                                {errors.tag.message}
                            </p>
                        )}
                    </div>


                    <div className="space-y-2">
                        <label className="text-sm font-medium">
                            Tag Color
                        </label>

                        <Input
                            placeholder="bg-green-600"
                            {...register("tagColor")}
                        />

                        {errors.tagColor && (
                            <p className="text-sm text-red-500">
                                {errors.tagColor.message}
                            </p>
                        )}
                    </div>

                    {/* Author */}


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


                    {/* Badge Color */}


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