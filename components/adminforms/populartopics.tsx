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

export const PopularSchema = z.object({
    topic: z.string().min(3, "Topic is required"),
    labelColor: z.string().min(1, "Enter a label Color URL"),
    href: z.string().min(1, "Href is required"),
    isActive: z.boolean(),
});

export type PopularValues = z.infer<typeof PopularSchema>;

export default function PopularTopicsForm() {
    const queryClient = useQueryClient();
    const [loading, setLoading] = useState(false);

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors },
    } = useForm<PopularValues>({
        resolver: zodResolver(PopularSchema),
        defaultValues: {


            topic: "",
            labelColor: "",

            href: "",

            isActive: false,
        },
    });

    const isActive = watch("isActive");










    const createPopularTopics = async (
        data: PopularValues
    ) => {
        const response = await fetch("/api/populartopics", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            throw new Error("Failed to create Popular News");
        }

        return response.json();
    };




    const mutation = useMutation({
        mutationFn: createPopularTopics,

        onSuccess: (data) => {
            console.log(data);
            queryClient.invalidateQueries();
            alert("Popular news created successfully");
        },

        onError: (error) => {
            console.error(error);
            alert("Failed to create Popular news");
        },
    });





    const onSubmit = async (
        values: PopularValues
    ) => {
        mutation.mutate(values);
        console.log(values)
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
                            placeholder="SSC CGL STUDY TIPS RRB"
                            {...register("topic")}
                        />

                        {errors.topic && (
                            <p className="text-sm text-red-500">
                                {errors.topic.message}
                            </p>
                        )}
                    </div>

                    {/* Image */}




                    {/* Date */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium">
                            Label Color
                        </label>

                        <Input
                            placeholder="bg-blue-100 text-blue-600"
                            {...register("labelColor")}
                        />

                        {errors.labelColor && (
                            <p className="text-sm text-red-500">
                                {errors.labelColor.message}
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