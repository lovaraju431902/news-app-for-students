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

export const TrendingNowSchema = z.object({
    title: z.string().min(3, "Title is required"),

    image: z.string().url("Enter a valid image URL"),



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

            date: "",

            href: "",

            isActive: false,
        },
    });

    const isActive = watch("isActive");










    const createTrendingNews = async (
        data: TrendingFormValues
    ) => {
        const response = await fetch("/api/trendingnews", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            throw new Error("Failed to create Trending News");
        }

        return response.json();
    };




    const mutation = useMutation({
        mutationFn: createTrendingNews,

        onSuccess: (data) => {
            console.log(data);
            queryClient.invalidateQueries();
            alert("Trending news created successfully");
        },

        onError: (error) => {
            console.error(error);
            alert("Failed to create Trending news");
        },
    });





    const onSubmit = async (
        values: TrendingFormValues
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
                        {mutation.isPending ? "Creating ..." : "Create "}
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
}