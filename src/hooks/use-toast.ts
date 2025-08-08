"use client";

import { toast } from "sonner";

type ToastStatus = "success" | "error" | "warning";

interface ToastOptions {
	description?: string;
	duration?: number;
	action?: {
		label: string;
		onClick: () => void;
	};
}

export function useToast() {
	const showToast = (
		status: ToastStatus,
		message: string,
		options: ToastOptions = {}
	) => {
		switch (status) {
			case "success":
				toast.success(message, {
					description: options.description,
					duration: options.duration ?? 3000,
					action: options.action,
				});
				break;
			case "error":
				toast.error(message, {
					description: options.description,
					duration: options.duration ?? 5000,
					action: options.action,
				});
				break;
			case "warning":
				toast.warning(message, {
					description: options.description,
					duration: options.duration ?? 4000,
					action: options.action,
				});
				break;
		}
	};

	return {
		toastSuccess: (message: string, options?: ToastOptions) =>
			showToast("success", message, options),
		toastError: (message: string, options?: ToastOptions) =>
			showToast("error", message, options),
		toastWarning: (message: string, options?: ToastOptions) =>
			showToast("warning", message, options),
	};
}
