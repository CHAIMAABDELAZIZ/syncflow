import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

export default function ProvisionalReportForm() {
    const { wellId } = useParams();
    const [forageId, setForageId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [originalOperations, setOriginalOperations] = useState({}); // Store original operations by phaseId
    const [originalPhases, setOriginalPhases] = useState({}); // Store original phase dates by phaseId

    const inputStyle = {
        backgroundColor: 'white',
    };

    const operationTypes = [
        "Drilling", "Mud logging", "Cementing", "Water supply", "Well head",
        "Casing tubing", "Casing accessoire", "Run casing", "Drilling bit",
        "Coring", "Drilling mud", "Logging", "Testing", "Sécurité"
    ];

    const [dateErrors, setDateErrors] = useState({
        phases: [{}, {}, {}, {}]
    });

    const [formData, setFormData] = useState({
        title: '',
        phases: [
            { number: 1, size: '26"', description: '', startDate: '', endDate: '', operations: [] },
            { number: 2, size: '16"', description: '', startDate: '', endDate: '', operations: [] },
            { number: 3, size: '12 1/4"', description: '', startDate: '', endDate: '', operations: [] },
            { number: 4, size: '8 1/2"', description: '', startDate: '', endDate: '', operations: [] }
        ]
    });

    // Utility to debounce a function
    const debounce = (func, delay) => {
        let timeoutId;
        return (...args) => {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => func(...args), delay);
        };
    };

    // Fetch forage_id, phases, and operations
    useEffect(() => {
        const fetchForageAndReportData = async () => {
            try {
                if (!wellId || isNaN(wellId)) {
                    throw new Error(`Invalid wellId: ${ wellId } `);
                }
                const puitIdNumber = Number(wellId);

                // Fetch forage_id
                const forageResponse = await axios.get(`http://localhost:8080/api/forages/puit/${puitIdNumber}`);
console.log('Forage API response:', forageResponse.data);
if (!forageResponse.data.success || !forageResponse.data.data.length) {
    throw new Error('No forages found for this well.');
}
const forageId = forageResponse.data.data[0].id;
setForageId(forageId);

// Fetch phases
const phasesResponse = await axios.get(`http://localhost:8080/api/phases/forage/${forageId}`);
console.log('Phases API response:', phasesResponse.data);

let fetchedPhases = formData.phases;
const originalOps = {};
const originalPhases = {};

if (phasesResponse.data.success && phasesResponse.data.data.length) {
    fetchedPhases = await Promise.all(
        phasesResponse.data.data.map(async (phase) => {
            const opsResponse = await axios.get(`http://localhost:8080/api/operations/phase/${phase.id}`);
            console.log(`Operations API response for phase ${phase.numeroPhase} (ID: ${phase.id}):`, opsResponse.data);

            const operations = opsResponse.data.success ? opsResponse.data.data : [];
            console.log(`Operations for phase ${phase.numeroPhase}:`, operations);

            // Store original operations by phaseId
            originalOps[phase.id] = operations.map(op => ({
                id: op.id,
                cost: op.coutPrev || 0
            }));

            // Store original phase dates by phaseId
            originalPhases[phase.id] = {
                startDate: phase.dateDebutPrevue ? phase.dateDebutPrevue.split('T')[0] : '',
                endDate: phase.dateFinPrevue ? phase.dateFinPrevue.split('T')[0] : ''
            };

            return {
                number: phase.numeroPhase || 0,
                size: diametreToSize[phase.diametre] || '',
                description: phase.description || '',
                startDate: phase.dateDebutPrevue ? phase.dateDebutPrevue.split('T')[0] : '',
                endDate: phase.dateFinPrevue ? phase.dateFinPrevue.split('T')[0] : '',
                operations: operations.map((op, index) => ({
                    id: op.id || index + 1,
                    name: codeToLabel[op.typeOperationCode] || op.description || 'Unknown Operation',
                    cost: op.coutPrev || 0,
                    status: op.statut === 'PLANIFIE' || op.statut === 'EN_COURS',
                    isNew: false
                }))
            };
        })
    );

    // Merge fetched phases with default phases
    const updatedPhases = formData.phases.map((defaultPhase) => {
        const fetchedPhase = fetchedPhases.find(p => p.number === defaultPhase.number);
        return fetchedPhase || defaultPhase;
    });

    setFormData((prev) => ({
        ...prev,
        title: `Report for Well #${puitIdNumber}`,
        phases: updatedPhases
    }));
    setOriginalOperations(originalOps);
    setOriginalPhases(originalPhases);
} else {
    console.log('No phases found, using default form data');
}
            } catch (err) {
    console.error('Error fetching data:', err.message);
    setError(err.message);
} finally {
    setLoading(false);
}
        };

fetchForageAndReportData();
    }, [wellId]);

const sizeToDiametre = {
    '26"': 'POUCES_26',
    '16"': 'POUCES_16',
    '12 1/4"': 'POUCES_12_25',
    '8 1/2"': 'POUCES_8_5',
};

const diametreToSize = Object.fromEntries(Object.entries(sizeToDiametre).map(([k, v]) => [v, k]));

const labelToCodeMap = {
    "Drilling": "DRILLING",
    "Mud logging": "MUD_LOGGING",
    "Cementing": "CEMENTING",
    "Water supply": "WATER_SUPPLY",
    "Well head": "WELL_HEAD",
    "Casing tubing": "CASING_TUBING",
    "Casing accessoire": "CASING_ACCESSORY",
    "Run casing": "RUN_CASING",
    "Drilling bit": "DRILLING_BIT",
    "Coring": "CORING",
    "Drilling mud": "DRILLING_MUD",
    "Logging": "LOGGING",
    "Testing": "TESTING",
    "Sécurité": "SECURITY"
};

const codeToLabel = Object.fromEntries(Object.entries(labelToCodeMap).map(([k, v]) => [v, k]));

const validateDates = (phases, phaseIndex, dateType, newValue) => {
    const newErrors = { ...dateErrors };
    const updatedPhase = { ...phases[phaseIndex] };

    if (dateType === 'startDate') {
        updatedPhase.startDate = newValue;
    } else {
        updatedPhase.endDate = newValue;
    }

    newErrors.phases[phaseIndex] = {};

    if (updatedPhase.startDate && updatedPhase.endDate) {
        if (new Date(updatedPhase.endDate) <= new Date(updatedPhase.startDate)) {
            newErrors.phases[phaseIndex].endDate = 'End date must be after start date';
        }
    }

    if (phaseIndex > 0) {
        const previousPhase = phases[phaseIndex - 1];
        if (previousPhase.endDate && updatedPhase.startDate) {
            if (new Date(updatedPhase.startDate) < new Date(previousPhase.endDate)) {
                newErrors.phases[phaseIndex].startDate = `Phase ${phaseIndex + 1} must start after Phase ${phaseIndex} ends`;
            }
        }
    }

    if (phaseIndex < phases.length - 1 && updatedPhase.endDate) {
        const nextPhase = phases[phaseIndex + 1];
        if (nextPhase.startDate) {
            if (new Date(nextPhase.startDate) < new Date(updatedPhase.endDate)) {
                newErrors.phases[phaseIndex + 1].startDate = `Phase ${phaseIndex + 2} must start after Phase ${phaseIndex + 1} ends`;
            }
        }
    }

    setDateErrors(newErrors);
    return newErrors;
};

const validateAllDates = () => {
    let hasErrors = false;
    const newErrors = { phases: [{}, {}, {}, {}] };

    formData.phases.forEach((phase, index) => {
        if (phase.startDate && phase.endDate) {
            if (new Date(phase.endDate) <= new Date(phase.startDate)) {
                newErrors.phases[index].endDate = 'End date must be after start date';
                hasErrors = true;
            }
        }

        if (index > 0) {
            const prevPhase = formData.phases[index - 1];
            if (prevPhase.endDate && phase.startDate) {
                if (new Date(phase.startDate) < new Date(prevPhase.endDate)) {
                    newErrors.phases[index].startDate = `Phase ${index + 1} must start after Phase ${index} ends`;
                    hasErrors = true;
                }
            }
        }
    });

    setDateErrors(newErrors);
    return !hasErrors;
};

const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
};

const handlePhaseDescriptionChange = (phaseIndex, newDescription) => {
    setFormData((prev) => {
        const newPhases = [...prev.phases];
        newPhases[phaseIndex].description = newDescription;
        return { ...prev, phases: newPhases };
    });
};

const handleDateChange = (phaseIndex, dateType, value) => {
    const updatedPhases = [...formData.phases];
    updatedPhases[phaseIndex][dateType] = value;
    validateDates(updatedPhases, phaseIndex, dateType, value);
    setFormData((prev) => ({ ...prev, phases: updatedPhases }));
};

const handleOperationStatusChange = (phaseIndex, operationId) => {
    setFormData((prev) => {
        const updatedPhases = [...prev.phases];
        const operation = updatedPhases[phaseIndex].operations.find(op => op.id === operationId);
        if (operation) operation.status = !operation.status;
        return { ...prev, phases: updatedPhases };
    });
};

const handleCostChange = (phaseIndex, operationId, value) => {
    const cost = Number(value);
    if (isNaN(cost) || cost < 0) {
        alert('Cost must be a non-negative number');
        return;
    }
    setFormData((prev) => {
        const updatedPhases = [...prev.phases];
        const operation = updatedPhases[phaseIndex].operations.find(op => op.id === operationId);
        if (operation) operation.cost = cost;
        return { ...prev, phases: updatedPhases };
    });
};

const handleOperationNameChange = (phaseIndex, operationId, value) => {
    setFormData((prev) => {
        const updatedPhases = [...prev.phases];
        const operation = updatedPhases[phaseIndex].operations.find(op => op.id === operationId);
        if (operation) operation.name = value;
        return { ...prev, phases: updatedPhases };
    });
};

const addOperation = debounce((phaseIndex) => {
    console.log(`Adding operation to phase ${phaseIndex}`);
    setFormData((prev) => {
        const updatedPhases = [...prev.phases];
        const newId = Math.max(0, ...prev.phases.flatMap(phase => phase.operations.map(op => op.id))) + 1;
        updatedPhases[phaseIndex].operations.push({
            id: newId,
            status: true,
            name: operationTypes[0], // Default to first valid type
            cost: 0,
            isNew: true
        });
        return { ...prev, phases: updatedPhases };
    });
}, 300);

const deleteOperation = (phaseIndex, operationId) => {
    setFormData((prev) => {
        const updatedPhases = [...prev.phases];
        updatedPhases[phaseIndex].operations = updatedPhases[phaseIndex].operations.filter(op => op.id !== operationId);
        return { ...prev, phases: updatedPhases };
    });
};

const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateAllDates()) {
        alert('Please fix date errors before submitting');
        return;
    }

    if (!forageId) {
        alert('Forage ID not available. Please try again.');
        return;
    }

    try {
        // Fetch existing phases
        const existingPhasesResponse = await axios.get(`http://localhost:8080/api/phases/forage/${forageId}`);
        const existingPhases = existingPhasesResponse.data.success ? existingPhasesResponse.data.data : [];
        const createdPhases = [];
        let operationsUpdated = false;
        let phasesUpdated = false;
        const invalidOperations = [];

        for (const [phaseIndex, phase] of formData.phases.entries()) {
            const phaseExists = existingPhases.some(p => p.numeroPhase === phase.number && String(p.forage?.id) === String(forageId));
            let phaseId;

            // Update or create phase
            if (phaseExists) {
                const existingPhase = existingPhases.find(p => p.numeroPhase === phase.number);
                phaseId = existingPhase.id;

                // Check for date changes
                const originalPhase = originalPhases[phaseId] || { startDate: '', endDate: '' };
                const startDateChanged = phase.startDate !== originalPhase.startDate;
                const endDateChanged = phase.endDate !== originalPhase.endDate;

                if (startDateChanged || endDateChanged) {
                    const phasePayload = {
                        id: phaseId,
                        forage: { id: forageId },
                        numeroPhase: phase.number,
                        diametre: sizeToDiametre[phase.size],
                        dateDebutPrevue: phase.startDate || null,
                        dateFinPrevue: phase.endDate || null,
                        description: phase.description || '',
                    };

                    console.log(`Updating phase ${phase.number} with new dates: start=${phase.startDate}, end=${phase.endDate}`);
                    const phaseResponse = await axios.put(`http://localhost:8080/api/phases/${phaseId}`, phasePayload);
                    if (!phaseResponse.data.success) {
                        console.warn(`Failed to update phase ${phase.number}`);
                        invalidOperations.push(`Phase ${phase.number}: Failed to update phase dates`);
                    } else {
                        phasesUpdated = true;
                        // Update originalPhases with new dates
                        setOriginalPhases((prev) => ({
                            ...prev,
                            [phaseId]: {
                                startDate: phase.startDate,
                                endDate: phase.endDate
                            }
                        }));
                    }
                }
            } else {
                const phasePayload = {
                    forage: { id: forageId },
                    numeroPhase: phase.number,
                    diametre: sizeToDiametre[phase.size],
                    dateDebutPrevue: phase.startDate || null,
                    dateFinPrevue: phase.endDate || null,
                    description: phase.description || '',
                };

                const phaseResponse = await axios.post('http://localhost:8080/api/phases', phasePayload);
                if (!phaseResponse.data.success) {
                    console.warn(`Failed to create phase ${phase.number}`);
                    continue;
                }
                phaseId = phaseResponse.data.data.id;
                createdPhases.push(phaseResponse.data.data);
                // Store original dates for new phase
                setOriginalPhases((prev) => ({
                    ...prev,
                    [phaseId]: {
                        startDate: phase.startDate,
                        endDate: phase.endDate
                    }
                }));
            }

            // Handle operations for the phase
            if (phase.operations?.length > 0) {
                const existingOpsResponse = await axios.get(`http://localhost:8080/api/operations/phase/${phaseId}`);
                const existingOps = existingOpsResponse.data.success ? existingOpsResponse.data.data : [];

                for (const operation of phase.operations) {
                    // Validate operation name
                    if (!operation.name || !operationTypes.includes(operation.name)) {
                        invalidOperations.push(`Phase ${phase.number}: Operation "${operation.name || 'No name'}" is invalid or not selected`);
                        console.warn(`Invalid operation in phase ${phase.number}: "${operation.name || 'No name'}"`);
                        continue;
                    }

                    const code = labelToCodeMap[operation.name];
                    if (!code) {
                        invalidOperations.push(`Phase ${phase.number}: Invalid operation type "${operation.name}"`);
                        console.warn(`Type d'opération inconnu : ${operation.name}`);
                        continue;
                    }

                    // Ensure cost is a number and non-negative
                    const cost = Number(operation.cost) || 0;
                    if (cost < 0) {
                        invalidOperations.push(`Phase ${phase.number}: Operation "${operation.name}" has invalid cost (${operation.cost})`);
                        console.warn(`Invalid cost for operation "${operation.name}" in phase ${phase.number}: ${operation.cost}`);
                        continue;
                    }

                    const operationPayload = {
                        phase: { id: phaseId },
                        description: operation.name || `Opération Phase ${phase.number}`,
                        coutPrev: cost,
                        coutReel: 0,
                        statut: operation.status ? 'PLANIFIE' : 'TERMINE',
                        typeOperation: { code },
                        createdBy: { id: 1 }, // TODO: Adapt to use logged-in user
                    };

                    // Check if operation is new (added by user) or existing
                    const isNew = operation.isNew || !existingOps.some(op => op.id === operation.id);

                    if (isNew) {
                        // Create new operation using fetch
                        console.log(`Creating operation "${operation.name}" in phase ${phase.number} with cost: ${cost}`);
                        const opResponse = await fetch('http://localhost:8080/api/operations', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                'Accept': 'application/json',
                            },
                            body: JSON.stringify(operationPayload),
                        });

                        if (!opResponse.ok) {
                            const opError = await opResponse.json().catch(() => ({ message: 'Unknown error' }));
                            const errorMessage = opError.message || (await opResponse.text());
                            invalidOperations.push(`Phase ${phase.number}: Failed to create operation "${operation.name}" - ${errorMessage}`);
                            console.warn(`❌ Échec création opération : ${errorMessage}`);
                        } else {
                            const responseData = await opResponse.json();
                            const newOperationId = responseData.data?.id;
                            const returnedCost = responseData.data?.coutPrev;
                            console.log(`Created operation "${operation.name}" in phase ${phase.number} with ID: ${newOperationId}, cost: ${returnedCost}`);

                            // Update formData with backend-assigned ID and cost
                            if (newOperationId) {
                                setFormData((prev) => {
                                    const updatedPhases = [...prev.phases];
                                    const newOp = updatedPhases[phaseIndex].operations.find(op => op.id === operation.id);
                                    if (newOp) {
                                        newOp.id = newOperationId;
                                        newOp.isNew = false;
                                        newOp.cost = Number(returnedCost) || cost;
                                    }
                                    return { ...prev, phases: updatedPhases };
                                });
                            }
                            operationsUpdated = true;
                        }
                    } else {
                        // Check for cost change in existing operation
                        const originalOp = originalOperations[phaseId]?.find(op => op.id === operation.id);
                        if (originalOp && originalOp.cost !== cost) {
                            // Update operation via PUT if cost has changed
                            console.log(`Updating operation "${operation.name}" in phase ${phase.number} with new cost: ${cost} (original: ${originalOp.cost})`);
                            const updatePayload = {
                                ...operationPayload,
                                id: operation.id,
                            };
                            const opResponse = await axios.put(`http://localhost:8080/api/operations/${operation.id}`, updatePayload);
                            if (!opResponse.data.success) {
                                console.warn(`Failed to update operation: ${operation.name}`);
                                invalidOperations.push(`Phase ${phase.number}: Failed to update operation "${operation.name}"`);
                            } else {
                                const returnedCost = opResponse.data.data?.coutPrev;
                                console.log(`Updated operation "${operation.name}" in phase ${phase.number} with cost: ${returnedCost}`);

                                // Update formData with backend cost
                                setFormData((prev) => {
                                    const updatedPhases = [...prev.phases];
                                    const updatedOp = updatedPhases[phaseIndex].operations.find(op => op.id === operation.id);
                                    if (updatedOp) {
                                        updatedOp.cost = Number(returnedCost) || cost;
                                    }
                                    return { ...prev, phases: updatedPhases };
                                });
                                operationsUpdated = true;
                            }
                        }
                    }
                }
            }
        }

        // Provide feedback to the user
        if (invalidOperations.length > 0) {
            alert(`Some operations or phases could not be saved:\n${invalidOperations.join('\n')}`);
        } else if (createdPhases.length > 0 || operationsUpdated || phasesUpdated) {
            alert(`Successfully saved ${createdPhases.length} new phases, ${operationsUpdated ? 'updated/created operations' : 'no operations changed'}, and ${phasesUpdated ? 'updated phase dates' : 'no phase dates changed'}.`);
        } else {
            alert('No changes were made to phases or operations.');
        }
    } catch (err) {
        console.error('Submission error:', err.message);
        alert(`Error: ${err.message}`);
    }
};

const handleDiscard = () => {
    setFormData({
        title: '',
        phases: [
            { number: 1, size: '26"', description: '', startDate: '', endDate: '', operations: [] },
            { number: 2, size: '16"', description: '', startDate: '', endDate: '', operations: [] },
            { number: 3, size: '12 1/4"', description: '', startDate: '', endDate: '', operations: [] },
            { number: 4, size: '8 1/2"', description: '', startDate: '', endDate: '', operations: [] }
        ]
    });
    setOriginalOperations({});
    setOriginalPhases({});
};

// Disable Save button if operations are invalid
const hasInvalidOperations = formData.phases.some(phase =>
    phase.operations.some(op => !op.name || !operationTypes.includes(op.name) || isNaN(Number(op.cost)) || Number(op.cost) < 0)
);

if (loading) return <div className="text-center py-6 text-gray-500">Loading...</div>;
if (error) return <div className="text-center py-6 text-red-500">Error: {error}</div>;

return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg p-6 shadow-sm">
        <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900">Provisional Report</h1>
            <p className="text-gray-500">Jun 12 2025</p>
        </div>

        <div className="bg-white rounded-lg p-6 mb-8 border shadow-md border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-lg font-medium mb-2">Title</label>
                    <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleInputChange}
                        className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-orange-500"
                        placeholder="Enter title of the report"
                        style={inputStyle}
                    />
                </div>
            </div>
        </div>

        {formData.phases.map((phase, phaseIndex) => (
            <div key={`phase-${phaseIndex}`} className="bg-white shadow-md rounded-lg p-6 mb-8 border border-gray-200">
                <h2 className="text-xl font-semibold mb-4">Phase {phase.number} - Forage {phase.size}</h2>
                <div className="mb-6">
                    <label className="block text-sm font-medium mb-1">Description</label>
                    <textarea
                        value={phase.description}
                        onChange={(e) => handlePhaseDescriptionChange(phaseIndex, e.target.value)}
                        rows={3}
                        className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-orange-500"
                        placeholder="Enter description for this phase"
                        style={inputStyle}
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                        <label className="block text-sm mb-1">Date de début prévue</label>
                        <input
                            type="date"
                            value={phase.startDate}
                            onChange={(e) => handleDateChange(phaseIndex, 'startDate', e.target.value)}
                            className={`w-full focus:outline-none focus:border-orange-500 border border-gray-300 rounded px-3 py-2 ${dateErrors.phases[phaseIndex]?.startDate ? 'border-red-500' : ''}`}
                            style={{ ...inputStyle, colorScheme: 'light' }}
                        />
                        {dateErrors.phases[phaseIndex]?.startDate && (
                            <p className="text-red-500 text-xs mt-1">{dateErrors.phases[phaseIndex].startDate}</p>
                        )}
                    </div>
                    <div>
                        <label className="block text-sm mb-1">Date de fin prévue</label>
                        <input
                            type="date"
                            value={phase.endDate}
                            onChange={(e) => handleDateChange(phaseIndex, 'endDate', e.target.value)}
                            className={`w-full focus:outline-none focus:border-orange-500 border border-gray-300 rounded px-3 py-2 ${dateErrors.phases[phaseIndex]?.endDate ? 'border-red-500' : ''}`}
                            style={{ ...inputStyle, colorScheme: 'light' }}
                        />
                        {dateErrors.phases[phaseIndex]?.endDate && (
                            <p className="text-red-500 text-xs mt-1">{dateErrors.phases[phaseIndex].endDate}</p>
                        )}
                    </div>
                </div>

                <div>
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="font-medium">Opérations prévues</h3>
                        <button
                            type="button"
                            onClick={() => addOperation(phaseIndex)}
                            className="text-orange-500 bg-white hover:bg-orange-50 transition-all duration-200 flex items-center px-3 py-1.5 rounded-md shadow-sm border hover:border-1 focus:ring-1 focus:ring-orange-500 hover:border-orange-500 focus:outline-none border-orange-200"
                        >
                            <span className="text-xl mr-1">+</span> Add operation
                        </button>
                    </div>
                    <p className="text-xs text-gray-500 mb-8">Mentionner les opérations prévues pour cette phase et indiquer leur coût prévisionnel</p>

                    {phase.operations.length > 0 ? (
                        <div>
                            <div className="grid grid-cols-12 bg-orange-500 text-white py-2 px-4 rounded-t-md">
                                <div className="col-span-2">Status</div>
                                <div className="col-span-5">Operation name</div>
                                <div className="col-span-4">Provisional cost</div>
                                <div className="col-span-1">Action</div>
                            </div>

                            {phase.operations.map((operation) => (
                                <div key={`operation-${operation.id}`} className="grid grid-cols-12 border-b border-x border-gray-200 py-2 px-4">
                                    <div className="col-span-2 flex items-center">
                                        <button
                                            type="button"
                                            className={`relative inline-flex h-7 w-14 items-center rounded-full ${operation.status ? 'bg-orange-500' : 'bg-gray-300'} transition-colors duration-200 ease-in-out focus:outline-none focus:ring-0`}
                                            onClick={() => handleOperationStatusChange(phaseIndex, operation.id)}
                                        >
                                            <span
                                                className={`inline-block h-6 w-6 transform rounded-full bg-white shadow transition-transform duration-200 ease-in-out ${operation.status ? 'translate-x-7' : 'translate-x-1'}`}
                                            />
                                        </button>
                                    </div>
                                    <div className="relative w-full col-span-5 flex items-center">
                                        <select
                                            value={operation.name}
                                            onChange={(e) => handleOperationNameChange(phaseIndex, operation.id, e.target.value)}
                                            className="appearance-none w-full border border-gray-300 rounded-md pl-3 pr-10 py-2 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition-all duration-150 ease-in-out shadow-sm"
                                            style={inputStyle}
                                        >
                                            <option value="" disabled>-- Sélectionnez une opération --</option>
                                            {operationTypes.map((type) => (
                                                <option key={type} value={type}>
                                                    {type}
                                                </option>
                                            ))}
                                        </select>
                                        <div className="pointer-events-none absolute right-3 text-gray-500">
                                            <svg
                                                className="w-5 h-5"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                                xmlns="http://www.w3.org/2000/svg"
                                            >
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                            </svg>
                                        </div>
                                    </div>
                                    <div className="col-span-4 flex items-center">
                                        <input
                                            type="number"
                                            min="0"
                                            step="0.01"
                                            value={operation.cost}
                                            onChange={(e) => handleCostChange(phaseIndex, operation.id, e.target.value)}
                                            className="w-24 border focus:outline-none focus:border-orange-500 border-gray-300 rounded px-3 py-1 text-right"
                                            style={{ ...inputStyle, colorScheme: 'light' }}
                                        />
                                    </div>
                                    <div className="col-span-1 text-center">
                                        <button
                                            type="button"
                                            onClick={() => deleteOperation(phaseIndex, operation.id)}
                                            className="text-red-500 bg-white px-0 border-none focus:outline-none hover:text-red-800"
                                            title="Supprimer l'opération"
                                        >
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="h-5 w-5 mx-auto"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-1.5 text-gray-400">No operations have been added yet.</div>
                    )}
                </div>
            </div>
        ))}

        <div className="flex justify-center space-x-2">
            <button
                type="button"
                onClick={handleDiscard}
                className="px-4 py-2 border border-gray-200 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-orange-2"
            >
                Discard
            </button>
            <button
                type="submit"
                disabled={hasInvalidOperations}
                className={`px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 ${hasInvalidOperations ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
                Save
            </button>
        </div>
    </form>
);
}