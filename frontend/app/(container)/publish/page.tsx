"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import {
    Save,
    Eye,
    Upload,
    X,
    AlertCircle,
    CheckCircle,
    Clock,
    ArrowRight,
    FileIcon,
    XCircle,
    Wallet,
    ExternalLink,
} from "lucide-react";
import { ContentPreviewModal } from "@/components/content-preview-modal";
import { RichTextEditor } from "@/components/rich-text-editor";
import { motion, useMotionTemplate } from "motion/react";
import { useColorAnimation } from "@/components/color-animation-provider";

// Viem imports
import {
    createPublicClient,
    createWalletClient,
    custom,
    http,
    parseAbiItem,
    decodeEventLog,
    Hash
} from 'viem';
import {  sepolia as monadTestnet } from 'viem/chains';
import { monadTestnetConfig } from "@/config/monad";

// Web3 related types
declare global {
    interface Window {
        ethereum?: any;
    }
}

interface PublishFormData {
    title: string;
    summary: string;
    content: string;
    coverImage: string;
}

interface ContractCallResult {
    success: boolean;
    transactionHash?: string;
    contentId?: string;
    contractAddress?: string;
    error?: string;
}

const initialFormData: PublishFormData = {
    title: "",
    summary: "",
    content: "",
    coverImage: "",
};

// ContentFactory contract ABI (only the functions we need)
const CONTENT_FACTORY_ABI = [
    parseAbiItem('function createContent(string _ipfsUrl)'),
    parseAbiItem('event ContentCreated(uint256 indexed contentId, address indexed contractAddress, string ipfsUrl, address indexed creator)')
] as const;

// Contract address (you need to replace this with your deployed contract address)
const CONTENT_FACTORY_ADDRESS = "0xEc845F3f96481BCfEc70A3f4118D000499985600" as `0x${string}`; // Replace with actual deployed contract address

// Chain configuration - change to mainnet for production
const CURRENT_CHAIN = monadTestnet; // or mainnet

export default function PublishPage() {
    const [formData, setFormData] = useState<PublishFormData>(initialFormData);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isPreviewOpen, setIsPreviewOpen] = useState(false);
    const [isDraft, setIsDraft] = useState(false);
    const [isPublishing, setIsPublishing] = useState(false);
    const [publishProgress, setPublishProgress] = useState(0);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [uploadResult, setUploadResult] = useState<string>("");

    // Web3 states
    const [isWalletConnected, setIsWalletConnected] = useState(false);
    const [walletAddress, setWalletAddress] = useState<string>("");
    const [isConnectingWallet, setIsConnectingWallet] = useState(false);
    const [publicClient, setPublicClient] = useState<any>(null);
    const [walletClient, setWalletClient] = useState<any>(null);
    const [contractResult, setContractResult] = useState<ContractCallResult | null>(null);

    // Check wallet connection on component mount
    useEffect(() => {
        checkWalletConnection();
    }, []);

    const checkWalletConnection = async () => {
        if (typeof window !== "undefined" && window.ethereum) {
            try {
                const accounts = await window.ethereum.request({ method: 'eth_accounts' });
                if (accounts.length > 0) {
                    setIsWalletConnected(true);
                    setWalletAddress(accounts[0]);

                    // Initialize viem clients
                    const publicClient = createPublicClient({
                        chain: CURRENT_CHAIN,
                        transport: http()
                    });

                    const walletClient = createWalletClient({
                        chain: CURRENT_CHAIN,
                        transport: custom(window.ethereum)
                    });

                    setPublicClient(publicClient);
                    setWalletClient(walletClient);
                }
            } catch (error) {
                console.error("Error checking wallet connection:", error);
            }
        }
    };

    const connectWallet = async () => {
        if (typeof window === "undefined" || !window.ethereum) {
            alert("Please install MetaMask wallet");
            return;
        }

        setIsConnectingWallet(true);
        try {
            // Request account access
            const accounts = await window.ethereum.request({
                method: 'eth_requestAccounts'
            });

            if (accounts.length > 0) {
                setIsWalletConnected(true);
                setWalletAddress(accounts[0]);

                // Initialize viem clients
                const publicClient = createPublicClient({
                    chain: CURRENT_CHAIN,
                    transport: http()
                });

                const walletClient = createWalletClient({
                    chain: CURRENT_CHAIN,
                    transport: custom(window.ethereum)
                });

                setPublicClient(publicClient);
                setWalletClient(walletClient);

            }
        } catch (error) {
            console.error("Wallet connection failed:", error);
            alert("Wallet connection failed");
        } finally {
            setIsConnectingWallet(false);
        }
    };

    const callCreateContentContract = async (ipfsHash: string): Promise<ContractCallResult> => {
        try {
            if (!walletClient || !publicClient || !isWalletConnected) {
                throw new Error("Wallet not connected");
            }


            // Call the contract function
            const hash = await walletClient.writeContract({
                address: CONTENT_FACTORY_ADDRESS,
                abi: CONTENT_FACTORY_ABI,
                functionName: 'createContent',
                args: [ipfsHash],
                account: walletAddress as `0x${string}`
            });

            // Wait for transaction confirmation
            const receipt = await publicClient.waitForTransactionReceipt({
                hash: hash as Hash
            });

            // Parse the ContentCreated event to get contentId and contract address
            let contentId = "";
            let contractAddress = "";

            if (receipt.logs && receipt.logs.length > 0) {
                try {
                    for (const log of receipt.logs) {
                        try {
                            const decodedLog = decodeEventLog({
                                abi: CONTENT_FACTORY_ABI,
                                data: log.data,
                                topics: log.topics,
                            });

                            if (decodedLog.eventName === 'ContentCreated') {
                                contentId = decodedLog.args.contentId.toString();
                                contractAddress = decodedLog.args.contractAddress;
                                break;
                            }
                        } catch (e) {
                            // Skip logs that don't match our ABI
                            continue;
                        }
                    }
                } catch (parseError) {
                    console.warn("Failed to parse event logs:", parseError);
                }
            }

            return {
                success: true,
                transactionHash: receipt.transactionHash,
                contentId,
                contractAddress
            };
        } catch (error: any) {
            console.error("Contract call failed:", error);

            let errorMessage = "Contract call failed";
            if (error.name === 'UserRejectedRequestError') {
                errorMessage = "User rejected the transaction";
            } else if (error.name === 'TransactionExecutionError') {
                errorMessage = "Transaction execution failed";
            } else if (error.message) {
                errorMessage = error.message;
            }

            return {
                success: false,
                error: errorMessage
            };
        }
    };

    // Calculate form completion progress
    const calculateProgress = () => {
        const fields = [
            formData.title,
            formData.summary,
            formData.content,
            formData.coverImage,
        ];
        const completed = fields.filter(Boolean).length;
        return Math.round((completed / fields.length) * 100);
    };

    const handleInputChange = (
        field: keyof PublishFormData,
        value: string
    ) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
        // Clear error when user starts typing
        if (errors[field]) {
            setErrors((prev) => ({ ...prev, [field]: "" }));
        }
    };

    const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            // Check if file is an image
            if (!file.type.startsWith('image/')) {
                setErrors(prev => ({ ...prev, coverImage: "Please select an image file" }));
                return;
            }
            setSelectedFile(file);
            setUploadResult("");
            setContractResult(null);
            // Create a preview URL for the selected image
            const previewUrl = URL.createObjectURL(file);
            handleInputChange("coverImage", previewUrl);
            // Clear error
            if (errors.coverImage) {
                setErrors(prev => ({ ...prev, coverImage: "" }));
            }
        }
    };

    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        if (!formData.title.trim()) newErrors.title = "Please enter content title";
        if (!formData.summary.trim()) newErrors.summary = "Please enter content summary";
        if (!formData.content.trim()) newErrors.content = "Please enter content body";
        if (!formData.coverImage) newErrors.coverImage = "Please upload cover image";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSaveDraft = async () => {
        setIsDraft(true);
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setIsDraft(false);
        // Show success message
    };

    const handlePublish = async () => {
        // Check wallet connection first
        if (!isWalletConnected) {
            alert("Please connect wallet first");
            return;
        }

        if (!validateForm()) return;

        setIsPublishing(true);
        setPublishProgress(0);
        setUploadResult("");
        setContractResult(null);

        try {
            // Step 1: Validate content format
            setPublishProgress(15);
            await new Promise((resolve) => setTimeout(resolve, 500));

            // Step 2: Convert cover image to base64 if it's a file
            setPublishProgress(25);
            let coverImageData = formData.coverImage;

            if (selectedFile) {
                // Convert image file to base64
                const reader = new FileReader();
                const base64Promise = new Promise<string>((resolve, reject) => {
                    reader.onload = () => resolve(reader.result as string);
                    reader.onerror = reject;
                });
                reader.readAsDataURL(selectedFile);
                coverImageData = await base64Promise;
            }

            // Step 3: Prepare complete content package
            setPublishProgress(35);
            const contentPackage = {
                metadata: {
                    title: formData.title,
                    summary: formData.summary,
                    timestamp: new Date().toISOString(),
                    author: walletAddress,
                    version: "1.0.0",
                    contentType: "article",
                },
                content: {
                    body: formData.content,
                    coverImage: coverImageData,
                },
            };

            // Step 4: Upload everything to IPFS as a single package
            setPublishProgress(50);
            const packageBlob = new Blob([JSON.stringify(contentPackage, null, 2)], {
                type: "application/json",
            });
            const packageFile = new File([packageBlob], "content-package.json", {
                type: "application/json",
            });

            const formDataToUpload = new FormData();
            formDataToUpload.append("file", packageFile);

            const response = await fetch("/api/upload", {
                method: "POST",
                body: formDataToUpload,
            });

            if (!response.ok) {
                throw new Error("Failed to upload content to IPFS");
            }

            const result = await response.json();
            const ipfsHash = result.ipfsHash;

            setPublishProgress(70);
            setUploadResult(`IPFS upload successful! Hash: ${ipfsHash}`);

            // Step 5: Call smart contract to create content on blockchain
            setPublishProgress(85);
            const contractResult = await callCreateContentContract(ipfsHash);

            if (contractResult.success) {
                setPublishProgress(100);
                setContractResult(contractResult);
                setUploadResult(`Published successfully! Content is on-chain!`);
            } else {
                throw new Error(contractResult.error || "Blockchain transaction failed");
            }

        } catch (error: any) {
            console.error("Publishing failed:", error);
            setUploadResult(`Publishing failed: ${error.message || error}`);
            setPublishProgress(0);
        } finally {
            setIsPublishing(false);
        }
    };

    // Add a function to manually reset the form
    const handleNewPublish = () => {
        setFormData(initialFormData);
        setSelectedFile(null);
        setUploadResult("");
        setContractResult(null);
        setPublishProgress(0);
    };

    const progress = calculateProgress();

    const color = useColorAnimation();
    const border = useMotionTemplate`1px solid ${color}30`;
    const boxShadow = useMotionTemplate`0px 4px 24px ${color}10`;
    const buttonBorder = useMotionTemplate`1px solid ${color}`;
    const buttonShadow = useMotionTemplate`0px 2px 8px ${color}20`;

    return (
        <main className="container mx-auto pt-8 py-4">
            {/* Header */}
            <motion.div
                className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
            >
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
                >
                    <h1 className="text-3xl md:text-4xl font-light mb-2 text-white">
                        Creation Center
                    </h1>
                    <p className="text-gray-400">Turn your knowledge into value</p>
                </motion.div>

                <motion.div
                    className="flex items-center gap-3"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
                >
                    {/* Wallet Connection Button */}
                    {!isWalletConnected ? (
                        <motion.button
                            onClick={connectWallet}
                            disabled={isConnectingWallet}
                            style={{
                                border: buttonBorder,
                                boxShadow: buttonShadow,
                            }}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="px-4 py-2 rounded-full text-sm font-medium bg-gradient-to-r from-blue-600 to-purple-600 text-white backdrop-blur-sm transition-colors hover:from-blue-500 hover:to-purple-500 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isConnectingWallet ? (
                                <>
                                    <Clock className="w-4 h-4 animate-spin" />
                                    Connecting...
                                </>
                            ) : (
                                <>
                                    <Wallet className="w-4 h-4" />
                                    Connect Wallet
                                </>
                            )}
                        </motion.button>
                    ) : (
                        <motion.div
                            className="px-4 py-2 rounded-full text-sm font-medium bg-green-600/20 text-green-300 border border-green-600/50 flex items-center gap-2"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                        >
                            <CheckCircle className="w-4 h-4" />
                            {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
                        </motion.div>
                    )}

                    <motion.button
                        onClick={handleSaveDraft}
                        disabled={isDraft || uploadResult.includes("发布成功")}
                        style={{
                            boxShadow: buttonShadow,
                        }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-4 py-2 rounded-full text-sm font-medium bg-gray-950/30 text-white backdrop-blur-sm transition-colors hover:bg-gray-950/50 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed border border-gray-700/50"
                    >
                        {isDraft ? (
                            <>
                                <Clock className="w-4 h-4 animate-spin" />
                                Saving...
                            </>
                        ) : (
                            <>
                                <Save className="w-4 h-4" />
                                Save Draft
                            </>
                        )}
                    </motion.button>

                    <motion.button
                        onClick={() => setIsPreviewOpen(true)}
                        style={{
                            boxShadow: buttonShadow,
                        }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-4 py-2 rounded-full text-sm font-medium bg-gray-950/30 text-white backdrop-blur-sm transition-colors hover:bg-gray-950/50 flex items-center gap-2 border border-gray-700/50"
                    >
                        <Eye className="w-4 h-4" />
                        Preview
                    </motion.button>

                    <motion.button
                        onClick={handlePublish}
                        disabled={isPublishing || uploadResult.includes("发布成功") || !isWalletConnected}
                        style={{
                            border: buttonBorder,
                            boxShadow: buttonShadow,
                        }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-4 py-2 rounded-full text-sm font-medium bg-gray-950/30 text-white backdrop-blur-sm transition-colors hover:bg-gray-950/50 flex items-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isPublishing ? (
                            <>
                                <Clock className="w-4 h-4 animate-spin" />
                                Publishing...
                            </>
                        ) : (
                            <>
                                Publish Content
                                <ArrowRight className="w-4 h-4 transition-transform group-hover:-rotate-45" />
                            </>
                        )}
                    </motion.button>
                </motion.div>
            </motion.div>

            {/* Progress Indicator */}
            <motion.div
                className="p-4 rounded-2xl bg-gray-950/30 backdrop-blur-sm mb-8"
                style={{ border, boxShadow }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
            >
                <div className="flex items-center justify-between mb-3">
                    <span className="text-sm text-gray-400">Completion Progress</span>
                    <motion.span
                        className="text-sm font-medium text-white"
                        style={{ color }}
                    >
                        {progress}%
                    </motion.span>
                </div>
                <div className="h-2 bg-gray-800/50 rounded-full overflow-hidden">
                    <motion.div
                        className="h-full rounded-full"
                        style={{
                            width: `${progress}%`,
                            background: color,
                        }}
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                    />
                </div>
            </motion.div>

            {/* Publishing Progress */}
            {isPublishing && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 rounded-2xl bg-gray-950/30 backdrop-blur-sm mb-8"
                    style={{ border, boxShadow }}
                >
                    <div className="flex items-center gap-3 mb-3">
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            style={{ color }}
                        >
                            <Clock className="w-5 h-5" />
                        </motion.div>
                        <span className="font-medium text-white">
                  {publishProgress <= 15 && "Validating content format..."}
                           {publishProgress > 15 && publishProgress <= 25 && "Processing cover image..."}
                           {publishProgress > 25 && publishProgress <= 35 && "Packing content data..."}
                           {publishProgress > 35 && publishProgress <= 50 && "Uploading to IPFS..."}
                           {publishProgress > 50 && publishProgress <= 70 && "IPFS upload complete..."}
                           {publishProgress > 70 && publishProgress <= 85 && "Calling smart contract..."}
                           {publishProgress > 85 && "Publishing complete!"}
                </span>
                    </div>
                    <div className="h-2 bg-gray-800/50 rounded-full overflow-hidden">
                        <motion.div
                            className="h-full rounded-full"
                            style={{
                                width: `${publishProgress}%`,
                                background: color,
                            }}
                            animate={{ width: `${publishProgress}%` }}
                            transition={{ duration: 0.3, ease: "easeOut" }}
                        />
                    </div>
                </motion.div>
            )}

            {/* Publish Result */}
            {uploadResult && (uploadResult.includes("Published successfully") || uploadResult.includes("发布成功")) && contractResult && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 rounded-2xl bg-green-900/20 border border-green-800/50 mb-8"
                >
                    <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3 flex-1">
                            <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                            <div className="flex-1">
                                <p className="text-green-300 font-medium">
                                    {uploadResult}
                                </p>
                                <p className="text-green-400/70 text-sm mt-1">
                                    Your content has been permanently stored on blockchain and IPFS network
                                </p>

                                {/* Contract Results */}
                                <div className="mt-3 space-y-2">
                                    {contractResult.contentId && (
                                        <div className="p-2 bg-gray-900/50 rounded-lg">
                                            <p className="text-xs text-gray-400 mb-1">Content ID:</p>
                                            <p className="text-xs text-green-400 font-mono">
                                                #{contractResult.contentId}
                                            </p>
                                        </div>
                                    )}

                                    {contractResult.contractAddress && (
                                        <div className="p-2 bg-gray-900/50 rounded-lg">
                                            <p className="text-xs text-gray-400 mb-1">ContentCoin Contract Address:</p>
                                            <p className="text-xs text-green-400 font-mono break-all">
                                                {contractResult.contractAddress}
                                            </p>
                                        </div>
                                    )}

                                    {contractResult.transactionHash && (
                                        <div className="p-2 bg-gray-900/50 rounded-lg">
                                            <div className="flex items-center justify-between">
                                                <div className="flex-1">
                                                    <p className="text-xs text-gray-400 mb-1">Transaction Hash:</p>
                                                    <p className="text-xs text-green-400 font-mono break-all">
                                                        {contractResult.transactionHash}
                                                    </p>
                                                </div>
                                                <a
                                                    // href={`https://${CURRENT_CHAIN.name === 'Monad Testnet' ? 'Monad Testnet.' : ''}etherscan.io/tx/${contractResult.transactionHash}`}
                                                    // https://etherscan.io/tx/0x06eba08751ae55533249fb81c0edb719320758e7b12b3c09bbeca80f8bcf272d
                                                    // https://sepolia.etherscan.io/tx/0x06eba08751ae55533249fb81c0edb719320758e7b12b3c09bbeca80f8bcf272d
                                                    href={`https://sepolia.etherscan.io/tx/${contractResult.transactionHash}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="ml-2 p-1 rounded hover:bg-gray-700/50 transition-colors"
                                                >
                                                    <ExternalLink className="w-3 h-3 text-green-400" />
                                                </a>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                        <motion.button
                            onClick={handleNewPublish}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="px-4 py-2 rounded-full text-sm font-medium bg-gray-900/50 text-white backdrop-blur-sm transition-colors hover:bg-gray-900/70 flex items-center gap-2 border border-gray-700/50"
                        >
                            <ArrowRight className="w-4 h-4" />
                            Publish New Content
                        </motion.button>
                    </div>
                </motion.div>
            )}

            {/* Error Result */}
            {uploadResult && (uploadResult.includes("failed") || uploadResult.includes("失败")) && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 rounded-2xl bg-red-900/20 border border-red-800/50 mb-8"
                >
                    <div className="flex items-center gap-3">
                        <XCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
                        <div className="flex-1">
                            <p className="text-red-300 font-medium">
                                {uploadResult}
                            </p>
                            <p className="text-red-400/70 text-sm mt-1">
                                Please check your network connection and wallet settings and try again
                            </p>
                        </div>
                    </div>
                </motion.div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Form */}
                <div className="lg:col-span-2">
                    <div className="space-y-6">
                        {/* Title */}
                        <motion.div
                            className="p-6 rounded-2xl bg-gray-950/30 backdrop-blur-sm"
                            style={{ border, boxShadow }}
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
                        >
                            <h3 className="text-lg font-medium mb-4 text-white">
                                Content Title
                            </h3>
                            <motion.input
                                placeholder="Enter an attractive title..."
                                value={formData.title}
                                onChange={(e) => handleInputChange("title", e.target.value)}
                                className="w-full px-3 py-2 bg-gray-900/50 border border-gray-700/50 text-white placeholder:text-gray-500 rounded-xl h-10 hover:bg-gray-900/70 transition-all focus:outline-none focus:ring-0"
                                whileFocus={{
                                    boxShadow: `0 0 0 2px ${color.get()}40`,
                                    borderColor: color.get(),
                                }}
                            />
                            {errors.title && (
                                <motion.div
                                    initial={{ opacity: 0, y: -5 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="mt-3 p-3 rounded-lg bg-red-500/10 border border-red-500/30"
                                >
                                    <div className="flex items-start gap-2">
                                        <AlertCircle className="h-4 w-4 text-red-400 mt-0.5" />
                                        <p className="text-sm text-red-400">{errors.title}</p>
                                    </div>
                                </motion.div>
                            )}
                        </motion.div>

                        {/* Summary */}
                        <motion.div
                            className="p-6 rounded-2xl bg-gray-950/30 backdrop-blur-sm"
                            style={{ border, boxShadow }}
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.5, ease: "easeOut" }}
                        >
                            <h3 className="text-lg font-medium mb-4 text-white">
                                Content Summary
                            </h3>
                            <motion.textarea
                                placeholder="Briefly describe your content..."
                                value={formData.summary}
                                onChange={(e) => handleInputChange("summary", e.target.value)}
                                className="w-full px-3 py-2 bg-gray-900/50 border border-gray-700/50 text-white placeholder:text-gray-500 min-h-[100px] rounded-xl hover:bg-gray-900/70 transition-all resize-none focus:outline-none focus:ring-0"
                                whileFocus={{
                                    boxShadow: `0 0 0 2px ${color.get()}40`,
                                    borderColor: color.get(),
                                }}
                            />
                            {errors.summary && (
                                <motion.div
                                    initial={{ opacity: 0, y: -5 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="mt-3 p-3 rounded-lg bg-red-500/10 border border-red-500/30"
                                >
                                    <div className="flex items-start gap-2">
                                        <AlertCircle className="h-4 w-4 text-red-400 mt-0.5" />
                                        <p className="text-sm text-red-400">{errors.summary}</p>
                                    </div>
                                </motion.div>
                            )}
                        </motion.div>

                        {/* Cover Image with IPFS Upload */}
                        <motion.div
                            className="p-6 rounded-2xl bg-gray-950/30 backdrop-blur-sm"
                            style={{ border, boxShadow }}
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.6, ease: "easeOut" }}
                        >
                            <h3 className="text-lg font-medium mb-4 text-white">
                                Cover Image
                            </h3>
                            <div className="space-y-4">
                                {/* File Selection */}
                                <div className="flex flex-col gap-4">
                                    <p className="text-sm text-gray-400">
                                        Select cover image (will be uploaded to IPFS with content)
                                    </p>

                                    <label className="relative cursor-pointer inline-block">
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleFileSelect}
                                            className="hidden"
                                        />
                                        <motion.div
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            className="px-6 py-3 rounded-full bg-gray-900/50 text-gray-200 border border-gray-700 hover:bg-gray-900/70 transition-colors inline-flex items-center gap-2"
                                        >
                                            <Upload className="w-4 h-4" />
                                            Select Image File
                                        </motion.div>
                                    </label>
                                </div>

                                {/* Selected File Info */}
                                {selectedFile && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="rounded-lg bg-gray-900/50 p-4 border border-gray-800"
                                    >
                                        <div className="flex items-center gap-3">
                                            <FileIcon className="w-5 h-5 text-gray-400" />
                                            <div className="flex-1">
                                                <p className="text-gray-200 font-medium truncate">
                                                    {selectedFile.name}
                                                </p>
                                                <p className="text-gray-500 text-sm">
                                                    {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                                                </p>
                                            </div>
                                            <motion.button
                                                onClick={() => {
                                                    setSelectedFile(null);
                                                    setUploadResult("");
                                                    setContractResult(null);
                                                    handleInputChange("coverImage", "");
                                                }}
                                                whileHover={{ scale: 1.1 }}
                                                whileTap={{ scale: 0.9 }}
                                                className="p-1.5 rounded-full bg-red-500/20 hover:bg-red-500/30 transition-colors"
                                            >
                                                <X className="w-4 h-4 text-red-400" />
                                            </motion.button>
                                        </div>

                                        {/* Image Preview */}
                                        {formData.coverImage && (
                                            <motion.div
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                className="mt-4"
                                            >
                                                <p className="text-sm text-gray-400 mb-2">Image Preview:</p>
                                                <img
                                                    src={formData.coverImage}
                                                    alt="Cover preview"
                                                    className="w-full h-48 object-cover rounded-lg"
                                                />
                                            </motion.div>
                                        )}
                                    </motion.div>
                                )}

                                {errors.coverImage && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -5 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="p-3 rounded-lg bg-red-500/10 border border-red-500/30"
                                    >
                                        <div className="flex items-start gap-2">
                                            <AlertCircle className="h-4 w-4 text-red-400 mt-0.5" />
                                            <p className="text-sm text-red-400">
                                                {errors.coverImage}
                                            </p>
                                        </div>
                                    </motion.div>
                                )}
                            </div>
                        </motion.div>

                        {/* Rich Text Editor */}
                        <motion.div
                            className="p-6 rounded-2xl bg-gray-950/30 backdrop-blur-sm"
                            style={{ border, boxShadow }}
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.7, ease: "easeOut" }}
                        >
                            <h3 className="text-lg font-medium mb-4 text-white">
                                Content Body
                            </h3>
                            <RichTextEditor
                                content={formData.content}
                                onChange={(content) => handleInputChange("content", content)}
                            />
                            {errors.content && (
                                <motion.div
                                    initial={{ opacity: 0, y: -5 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="mt-3 p-3 rounded-lg bg-red-500/10 border border-red-500/30"
                                >
                                    <div className="flex items-start gap-2">
                                        <AlertCircle className="h-4 w-4 text-red-400 mt-0.5" />
                                        <p className="text-sm text-red-400">{errors.content}</p>
                                    </div>
                                </motion.div>
                            )}
                        </motion.div>
                    </div>
                </div>

                {/* Sidebar */}
                <div className="lg:col-span-1">
                    <motion.div
                        className="sticky top-4 p-6 rounded-2xl bg-gray-950/30 backdrop-blur-sm"
                        style={{ border, boxShadow }}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.8, ease: "easeOut" }}
                    >
                        <h3 className="text-lg font-medium mb-4 text-white">Publishing Guide</h3>

                        <div className="space-y-4">
                            <div className="space-y-3">
                                {[
                                    "Connect Web3 wallet",
                                    "Use an attractive title",
                                    "Add high-quality cover image",
                                    "Clear content structure",
                                    "Keep content original",
                                    "Optimize reading experience",
                                ].map((item, index) => (
                                    <motion.div
                                        key={item}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.9 + index * 0.1, ease: "easeOut" }}
                                        className="flex items-center gap-3"
                                    >
                                        <motion.div
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            transition={{ delay: 1.0 + index * 0.1, type: "spring", stiffness: 200 }}
                                            style={{
                                                color: (index === 0 && isWalletConnected) ? color :
                                                    (index === 0 && !isWalletConnected) ? "#6b7280" : color
                                            }}
                                        >
                                            <CheckCircle className="w-4 h-4" />
                                        </motion.div>
                                        <span className={`text-sm ${
                                            index === 0 && isWalletConnected ? "text-green-300" :
                                                index === 0 && !isWalletConnected ? "text-gray-500" : "text-gray-300"
                                        }`}>
                          {item}
                        </span>
                                    </motion.div>
                                ))}
                            </div>

                            <motion.div
                                className="pt-4 border-t border-gray-700/50"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 1.4, duration: 0.5, ease: "easeOut" }}
                            >
                                <h4 className="font-medium mb-3 text-white">Publishing Tips</h4>
                                <div className="space-y-2">
                                    <p className="text-xs text-gray-400">
                                        • Content will be permanently stored on blockchain once published
                                    </p>
                                    <p className="text-xs text-gray-400">
                                        • Small gas fee required for on-chain transaction
                                    </p>
                                    <p className="text-xs text-gray-400">
                                        • Please ensure content complies with community guidelines
                                    </p>
                                    <p className="text-xs text-gray-400">
                                        • High-quality content will get more exposure
                                    </p>
                                </div>
                            </motion.div>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Preview Modal */}
            <ContentPreviewModal
                isOpen={isPreviewOpen}
                onClose={() => setIsPreviewOpen(false)}
                content={{
                    title: formData.title || "Content Title",
                    summary: formData.summary || "Content Summary",
                    content: formData.content || "Content Body",
                    coverImage:
                        formData.coverImage || "/placeholder.svg?height=300&width=600",
                    price: 0,
                    tags: [],
                    category: "Uncategorized",
                }}
            />
        </main>
    );
}