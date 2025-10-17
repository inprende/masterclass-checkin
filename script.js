// Liderazgo Endpoint
// const endpoint = "https://script.google.com/macros/s/AKfycbyz8k8yO26tSN7c3DX4eSroafsUap0WTLhtHsOt94Kyv3a1gzWD5_WBKhUF4RIogzc4/exec";
// Emociones Endpoint
// const endpoint = "https://script.google.com/macros/s/AKfycbx5e5dBSC5I2DPjB04QI4NHx1ovngXHO54Adn2_Iq11gqztoLSqMzyU1-j6RNpRFrDJ/exec";
// INtraemprendimiento Endpoint
// const endpoint="https://script.google.com/macros/s/AKfycbwoHsIe74C_17h6GqnXcUPt9EiKwwmKZBnpokgOVofiL-U4tPFrxci-uvZ_yEffb9HnzQ/exec"

// Mindset Endpoint
const endpoint = "https://script.google.com/macros/s/AKfycbyItjDQP98VYol9AGhoaRQNCuPFRdlldAIk2zdeo1SFBeWBsmjCjb63pfZGhwTSAt0NYQ/exec";

let html5QrCode;
let isScanning = false;

function checkIn() {
    const email = document.getElementById("email").value.trim();
    const responseEl = document.getElementById("manual-response");
    const qrResponseEl = document.getElementById("qr-response");
    const submitButton = document.getElementById("submitButton");
    submitButton.disabled = true;

    // Clear all previous responses
    responseEl.textContent = "";
    responseEl.className = "";
    qrResponseEl.textContent = "";
    qrResponseEl.className = "";

    if (!email) {
        responseEl.textContent = "❌ Debes ingresar un correo.";
        responseEl.className = "text-lg my-5 p-4 rounded-lg min-h-[20px] bg-error-bg text-error-text border border-error-border";
        submitButton.disabled = false;
        return;
    }

    responseEl.textContent = "⏳ Registrando asistencia...";
    responseEl.className = "text-lg my-5 p-4 rounded-lg min-h-[20px]";

    fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: `email=${encodeURIComponent(email)}`
    })
        .then(res => res.json())
        .then(data => {
            responseEl.textContent = data.message;

            // Set styling based on status
            if (data.status === "success") {
                responseEl.className = "text-lg my-5 p-4 rounded-lg min-h-[20px] bg-success-bg text-success-text border border-success-border";
            } else if (data.status === "warning") {
                responseEl.className = "text-lg my-5 p-4 rounded-lg min-h-[20px] bg-yellow-100 text-yellow-800 border border-yellow-300";
            } else if (data.status === "error") {
                responseEl.className = "text-lg my-5 p-4 rounded-lg min-h-[20px] bg-error-bg text-error-text border border-error-border";
            }

            // Clear email field after successful registration
            if (data.status === "success") {
                setTimeout(() => {
                    document.getElementById("email").value = "";
                }, 2000);
            }
        })
        .catch(() => {
            responseEl.textContent = "❌ Error en la conexión.";
            responseEl.className = "text-lg my-5 p-4 rounded-lg min-h-[20px] bg-error-bg text-error-text border border-error-border";
        })
        .finally(() => {
            submitButton.disabled = false;
        });
}

// QR Check-in function (separate from manual)
function qrCheckIn(email) {
    const responseEl = document.getElementById("qr-response");
    const manualResponseEl = document.getElementById("manual-response");
    const submitButton = document.getElementById("submitButton");
    submitButton.disabled = true;

    // Clear all previous responses
    responseEl.textContent = "";
    responseEl.className = "";
    manualResponseEl.textContent = "";
    manualResponseEl.className = "";

    responseEl.textContent = "⏳ Procesando QR escaneado...";
    responseEl.className = "text-lg my-5 p-4 rounded-lg min-h-[20px]";

    fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: `email=${encodeURIComponent(email)}`
    })
        .then(res => res.json())
        .then(data => {
            responseEl.textContent = `📱 ${data.message}`;

            // Set styling based on status
            if (data.status === "success") {
                responseEl.className = "text-lg my-5 p-4 rounded-lg min-h-[20px] bg-success-bg text-success-text border border-success-border";
            } else if (data.status === "warning") {
                responseEl.className = "text-lg my-5 p-4 rounded-lg min-h-[20px] bg-yellow-100 text-yellow-800 border border-yellow-300";
            } else if (data.status === "error") {
                responseEl.className = "text-lg my-5 p-4 rounded-lg min-h-[20px] bg-error-bg text-error-text border border-error-border";
            }

            // Clear QR response after 5 seconds
            setTimeout(() => {
                responseEl.textContent = "";
                responseEl.className = "";
                submitButton.disabled = false;
            }, 2000);
        })
        .catch(() => {
            responseEl.textContent = "📱 ❌ Error en la conexión del QR.";
            responseEl.className = "text-lg my-5 p-4 rounded-lg min-h-[20px] bg-error-bg text-error-text border border-error-border";

            // Clear QR response after 5 seconds
            setTimeout(() => {
                responseEl.textContent = "";
                responseEl.className = "";
            }, 5000);
        });
}

// QR Code success callback
const qrCodeSuccessCallback = (decodedText, decodedResult) => {
    // Prevent multiple rapid scans
    if (isScanning) return;

    isScanning = true;

    console.log(`Code matched = ${decodedText}`, decodedResult);

    // Clear all previous responses at start of QR scan
    document.getElementById("manual-response").textContent = "";
    document.getElementById("manual-response").className = "";
    document.getElementById("qr-response").textContent = "";
    document.getElementById("qr-response").className = "";

    // Place the QR result in the email input field
    const emailInput = document.getElementById("email");
    emailInput.value = decodedText;

    // Add visual feedback that QR was scanned
    emailInput.style.borderColor = "#28a745";
    emailInput.style.backgroundColor = "#d4edda";

    document.getElementById("camera-status").textContent = "✅ QR escaneado - Procesando...";
    document.getElementById("camera-status").className = "my-4 p-3 font-medium text-base text-green-600 font-semibold";

    // Auto-submit using QR-specific function
    setTimeout(() => {
        qrCheckIn(decodedText);
    }, 500); // Small delay to show the visual feedback

    // Reset visual feedback and allow scanning again after 6 seconds
    setTimeout(() => {
        isScanning = false;
        emailInput.style.borderColor = "#ddd";
        emailInput.style.backgroundColor = "white";
        emailInput.value = ""; // Clear the input after QR scan        // Clear all response messages when ready for next scan
        document.getElementById("manual-response").textContent = "";
        document.getElementById("manual-response").className = "";
        document.getElementById("qr-response").textContent = "";
        document.getElementById("qr-response").className = "";

        document.getElementById("camera-status").textContent = "📷 Listo para escanear - Enfoca el código QR";
        document.getElementById("camera-status").className = "my-4 p-3 font-medium text-base text-green-600";
    }, 12000);
};

// QR Code error callback
const qrCodeErrorCallback = (errorMessage) => {
    // Handle scan failure silently - this is normal during scanning
    // console.warn(`Code scan error = ${errorMessage}`);
};

// Initialize the scanner when page loads
window.addEventListener('load', () => {
    setTimeout(() => {
        try {
            html5QrCode = new Html5Qrcode("qr-reader");

            // Add Tailwind classes to QR reader container
            const qrReaderEl = document.getElementById("qr-reader");
            qrReaderEl.className = "w-full max-w-sm mx-auto";

            document.getElementById("camera-status").textContent = "🔍 Iniciando cámara...";
            document.getElementById("camera-status").className = "my-4 p-3 font-medium text-base text-blue-500";

            const config = {
                fps: 10,
                qrbox: { width: 250, height: 250 },
                aspectRatio: 1.0
            };

            // Try to prefer back camera first (better for QR scanning)
            html5QrCode.start(
                { facingMode: "environment" }, // Back camera
                config,
                qrCodeSuccessCallback,
                qrCodeErrorCallback
            ).then(() => {
                document.getElementById("camera-status").textContent = "📷 Listo para escanear - Enfoca el código QR";
                document.getElementById("camera-status").className = "my-4 p-3 font-medium text-base text-green-600";
                console.log("QR Scanner iniciado con cámara trasera");

                // Style the QR reader video and dashboard elements with Tailwind
                setTimeout(() => {
                    const video = document.querySelector("#qr-reader video");
                    if (video) {
                        video.className = "rounded-lg w-full";
                    }
                    const dashboard = document.querySelector("#qr-reader__dashboard");
                    if (dashboard) {
                        dashboard.className = "bg-gray-100 rounded-lg p-3 mt-3";
                    }
                }, 1000);

            }).catch(err => {
                console.warn("No se pudo usar cámara trasera, intentando frontal...", err);

                // Fallback to front camera
                html5QrCode.start(
                    { facingMode: "user" }, // Front camera
                    config,
                    qrCodeSuccessCallback,
                    qrCodeErrorCallback
                ).then(() => {
                    document.getElementById("camera-status").textContent = "📷 Listo para escanear - Enfoca el código QR";
                    document.getElementById("camera-status").className = "my-4 p-3 font-medium text-sm md:text-base text-green-600";
                    console.log("QR Scanner iniciado con cámara frontal");
                }).catch(err2 => {
                    console.error("Error con ambas cámaras:", err2);

                    // Final fallback - let browser choose
                    html5QrCode.start(
                        { video: true }, // Any available camera
                        config,
                        qrCodeSuccessCallback,
                        qrCodeErrorCallback
                    ).then(() => {
                        document.getElementById("camera-status").textContent = "📷 Listo para escanear - Enfoca el código QR";
                        document.getElementById("camera-status").className = "my-4 p-3 font-medium text-base text-green-600";
                        console.log("QR Scanner iniciado con cámara por defecto");
                    }).catch(err3 => {
                        console.error("Error al inicializar cualquier cámara:", err3);

                        if (err3.name === 'NotAllowedError') {
                            document.getElementById("camera-permissions").style.display = "block";
                            document.getElementById("camera-status").textContent = "❌ Acceso a cámara denegado";
                        } else if (err3.name === 'NotFoundError') {
                            document.getElementById("camera-status").textContent = "❌ No se encontró ninguna cámara";
                        } else {
                            document.getElementById("camera-status").textContent = `❌ Error: ${err3.message}`;
                        }
                        document.getElementById("camera-status").className = "my-4 p-3 font-medium text-base text-red-600";
                    });
                });
            });

        } catch (error) {
            console.error("Error initializing Html5Qrcode:", error);
            document.getElementById("camera-status").textContent = "❌ Error al inicializar el escáner";
            document.getElementById("camera-status").className = "my-4 p-3 font-medium text-base text-red-600";
        }
    }, 1000);
});

// Handle Enter key in email input
document.getElementById("email").addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        checkIn();
    }
});

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
    if (html5QrCode?.isScanning) {
        html5QrCode.stop().catch(err => {
            console.error("Error stopping scanner:", err);
        });
    }
});
