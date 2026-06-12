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

export const WebStorySchema = z.object({
    title: z.string().min(3, "Title is required"),
    image: z.string().min(1, "Image is required"),
    href: z.string().min(1, "Link is required"),
    isActive: z.boolean(),
});

export type WebStoryFormValues = z.infer<typeof WebStorySchema>;

export default function WebStoryForm() {
    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors },
    } = useForm<WebStoryFormValues>({
        resolver: zodResolver(WebStorySchema),
        defaultValues: {
            title: "",

            image: "",

            href: "",
            isActive: false,
        },
    });

    const isActive = watch("isActive");


    const createWebStory = async (data: WebStoryFormValues) => {
        const response = await fetch("/api/webstories", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            throw new Error("Failed to create Web Story");
        }

        return response.json();
    };

    const mutation = useMutation({
        mutationFn: createWebStory,
        onSuccess: () => {
            alert("Web Story created successfully");
        },
        onError: (error) => {
            console.error(error);
            alert("Failed to create Web Story");
        },
    });

    const onSubmit = async (values: WebStoryFormValues) => {
        mutation.mutate(values);
    };

    return (
        <Card className="max-w-3xl">
            <CardHeader>
                <CardTitle>Create Web Story</CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                    {/* Title */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Title</label>
                        <Input
                            placeholder="Enter Web Story Title"
                            {...register("title")}
                        />
                        {errors.title && (
                            <p className="text-sm text-red-500">{errors.title.message}</p>
                        )}
                    </div>



                    {/* Link */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Imageurl</label>
                        <Input
                            placeholder="/imageurl"
                            {...register("image")}
                        />
                        {errors.image && (
                            <p className="text-sm text-red-500">{errors.image.message}</p>
                        )}
                    </div>



                    {/* Link */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Link</label>
                        <Input
                            placeholder="/stories/1"
                            {...register("href")}
                        />
                        {errors.href && (
                            <p className="text-sm text-red-500">{errors.href.message}</p>
                        )}
                    </div>

                    {/* Active Switch */}
                    <div className="flex items-center justify-between rounded-lg border p-4">
                        <div>
                            <p className="font-medium">Active Web Story</p>
                            <p className="text-sm text-muted-foreground">
                                Show this story on the homepage
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
                        {mutation.isPending ? "Creating Web Story..." : "Create Web Story"}
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
}
