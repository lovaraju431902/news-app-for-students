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

export const StudymaterialSchema = z.object({
    title: z.string().min(3, "Title is required"),




    href: z.string().min(1, "Href is required"),



    isActive: z.boolean(),
});

export type StudymaterialValues = z.infer<typeof StudymaterialSchema>;

export default function StudyMaterialForm() {
    const queryClient = useQueryClient();
    const [loading, setLoading] = useState(false);

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors },
    } = useForm<StudymaterialValues>({
        resolver: zodResolver(StudymaterialSchema),
        defaultValues: {
            title: "",




            href: "",

            isActive: false,
        },
    });

    const isActive = watch("isActive");










    const createStudymaterial = async (
        data: StudymaterialValues
    ) => {
        const response = await fetch("/api/studymaterial", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            throw new Error("Failed to create StudyMaterial News");
        }

        return response.json();
    };




    const mutation = useMutation({
        mutationFn: createStudymaterial,

        onSuccess: (data) => {
            console.log(data);
            queryClient.invalidateQueries();
            alert("Studymaterial news created successfully");
        },

        onError: (error) => {
            console.error(error);
            alert("Failed to create studymaterial news");
        },
    });





    const onSubmit = async (
        values: StudymaterialValues
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




                    {/* Date */}






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