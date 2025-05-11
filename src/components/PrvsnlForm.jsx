import React from 'react'
import { useState } from 'react';

export default function PrvsnlForm() {
    const inputStyle = {
        backgroundColor: 'white',
    };

    // Added state for validation errors
    const [dateErrors, setDateErrors] = useState({
        phases: [{}, {}, {}, {}]
    });

    const [formData, setFormData] = useState({
        title: '',
        concernedWell: 'Well#A-109',
        phases: [
          {
            number: 1,
            size: '26"',
            startDate: '',
            endDate: '',
            operations: [
              { id: 1, status: true, name: 'Drilling les cfs', cost: 500 },
              { id: 2, status: true, name: 'Drilling lwessemou', cost: 500 },
            ]
          },
          {
            number: 2,
            size: '16"',
            startDate: '',
            endDate: '',
            operations: [
              { id: 3, status: true, name: 'Drilling les cfs', cost: 500 },
              { id: 4, status: true, name: 'Drilling lwessemou', cost: 500 },
            ]
          },
          {
            number: 3,
            size: '12 1/4"',
            startDate: '',
            endDate: '',
            operations: []
          },
          {
            number: 4,
            size: '8 1/4"',
            startDate: '',
            endDate: '',
            operations: []
          }
        ]
      });
    
    // Validate date logic
    const validateDates = (phases, phaseIndex, dateType, newValue) => {
        const newErrors = { ...dateErrors };
        const updatedPhase = { ...phases[phaseIndex] };
        
        // Determine which date was changed
        if (dateType === 'startDate') {
            updatedPhase.startDate = newValue;
        } else {
            updatedPhase.endDate = newValue;
        }
        
        // Clear previous errors for this phase
        newErrors.phases[phaseIndex] = {};
        
        // Rule 1: End date must be after start date in the same phase
        if (updatedPhase.startDate && updatedPhase.endDate) {
            if (new Date(updatedPhase.endDate) <= new Date(updatedPhase.startDate)) {
                newErrors.phases[phaseIndex].endDate = 'End date must be after start date';
            }
        }
        
        // Rule 2: Phase intervals must be sequential
        if (phaseIndex > 0) {
            const previousPhase = phases[phaseIndex - 1];
            
            // Current phase's start date should be after previous phase's end date
            if (previousPhase.endDate && updatedPhase.startDate) {
                if (new Date(updatedPhase.startDate) < new Date(previousPhase.endDate)) {
                    newErrors.phases[phaseIndex].startDate = `Phase ${phaseIndex + 1} must start after Phase ${phaseIndex} ends`;
                }
            }
        }
        
        // Check if this change affects subsequent phases
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
    
    // Handle form input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };
    
    // Handle date changes for specific phase with validation
    const handleDateChange = (phaseIndex, dateType, value) => {
        const updatedPhases = [...formData.phases];
        updatedPhases[phaseIndex][dateType] = value;
        
        // Validate the new date
        validateDates(updatedPhases, phaseIndex, dateType, value);
        
        setFormData({
            ...formData,
            phases: updatedPhases
        });
    };
    
    // Handle operation status toggle
    const handleOperationStatusChange = (phaseIndex, operationId) => {
        const updatedPhases = [...formData.phases];
        const operationIndex = updatedPhases[phaseIndex].operations.findIndex(op => op.id === operationId);
        if (operationIndex !== -1) {
            updatedPhases[phaseIndex].operations[operationIndex].status = 
                !updatedPhases[phaseIndex].operations[operationIndex].status;
            setFormData({
                ...formData,
                phases: updatedPhases
            });
        }
    };
    
    // Handle operation cost change
    const handleCostChange = (phaseIndex, operationId, value) => {
        const updatedPhases = [...formData.phases];
        const operationIndex = updatedPhases[phaseIndex].operations.findIndex(op => op.id === operationId);
        if (operationIndex !== -1) {
            updatedPhases[phaseIndex].operations[operationIndex].cost = value;
            setFormData({
                ...formData,
                phases: updatedPhases
            });
        }
    };
    
    // Add new operation to a phase
    const addOperation = (phaseIndex) => {
        const updatedPhases = [...formData.phases];
        const newId = Math.max(0, ...formData.phases.flatMap(phase => 
            phase.operations.map(op => op.id))) + 1;
        
        updatedPhases[phaseIndex].operations.push({
            id: newId,
            status: true,
            name: 'New Operation',
            cost: 0
        });
        
        setFormData({
            ...formData,
            phases: updatedPhases
        });
    };
    
    // Delete an operation
    const deleteOperation = (phaseIndex, operationId) => {
        const updatedPhases = [...formData.phases];
        const operationIndex = updatedPhases[phaseIndex].operations.findIndex(op => op.id === operationId);
        if (operationIndex !== -1) {
            updatedPhases[phaseIndex].operations.splice(operationIndex, 1);
            setFormData({
                ...formData,
                phases: updatedPhases
            });
        }
    };
    
    // Handle operation name change
    const handleOperationNameChange = (phaseIndex, operationId, value) => {
        const updatedPhases = [...formData.phases];
        const operationIndex = updatedPhases[phaseIndex].operations.findIndex(op => op.id === operationId);
        if (operationIndex !== -1) {
            updatedPhases[phaseIndex].operations[operationIndex].name = value;
            setFormData({
                ...formData,
                phases: updatedPhases
            });
        }
    };
    
    // Validate all dates before submission
    const validateAllDates = () => {
        let hasErrors = false;
        const newErrors = { phases: [{}, {}, {}, {}] };
        
        // Validate each phase's dates
        formData.phases.forEach((phase, index) => {
            // End date must be after start date
            if (phase.startDate && phase.endDate) {
                if (new Date(phase.endDate) <= new Date(phase.startDate)) {
                    newErrors.phases[index].endDate = 'End date must be after start date';
                    hasErrors = true;
                }
            }
            
            // Phases must be sequential
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
    
    // Handle form submission with validation
    const handleSubmit = (e) => {
        e.preventDefault();
        
        // Validate all dates before submission
        if (validateAllDates()) {
            console.log('Form Data:', formData);
            // Here you would typically send the data to an API
            alert('Form submitted successfully!');
        } else {
            alert('Please fix date errors before submitting');
        }
    };
    
    // Handle form discard
    const handleDiscard = () => {
        // Reset form or navigate away
        console.log('Form discarded');
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white rounded-lg p-6 shadow-sm">
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900">Fill a provisional report</h1>
                <p className="text-gray-500">Jun 1 2025</p>
            </div>
            
            {/* Title and Well Section */}
            <div className="bg-white rounded-lg p-6 mb-8 border shadow-md border-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-lg font-medium mb-2">Title</label>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleInputChange}
                            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-orangePtrm"
                            placeholder="Enter title of the report"
                            style={inputStyle}
                        />
                    </div>
                    <div>
                        <label className="block text-lg font-medium mb-2">Concerned well</label>
                        <div className="relative">
                            <select
                                name="concernedWell"
                                value={formData.concernedWell}
                                onChange={handleInputChange}
                                className="w-full focus:outline-none focus:border-orangePtrm border border-gray-300 rounded px-3 py-2 appearance-none"
                                style={inputStyle}
                            >
                                <option value="Well#A-109">Well#A-109</option>
                                <option value="Well#B-201">Well#B-201</option>
                                <option value="Well#C-303">Well#C-303</option>
                            </select>
                            <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Phases Sections */}
            {formData.phases.map((phase, phaseIndex) => (
                <div key={`phase-${phaseIndex}`} className="bg-white shadow-md rounded-lg p-6 mb-8 border border-gray-200">
                    <h2 className="text-xl font-semibold mb-4">Phase {phase.number} - Forage {phase.size}</h2>
                    
                    {/* Dates */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div>
                            <label className="block text-sm mb-1">Date de début prévue</label>
                            <input
                                type="date"
                                value={phase.startDate}
                                onChange={(e) => handleDateChange(phaseIndex, 'startDate', e.target.value)}
                                className={`w-full focus:outline-none focus:border-orangePtrm border border-gray-300 rounded px-3 py-2 ${dateErrors.phases[phaseIndex]?.startDate ? 'border-red-500' : ''}`}
                                style={{
                                    ...inputStyle,
                                    colorScheme: 'light'
                                }}
                            />
                            {dateErrors.phases[phaseIndex]?.startDate && (
                                <p className="text-red-500 text-xs mt-1">{dateErrors.phases[phaseIndex].startDate}</p>
                            )}
                        </div>
                        <div>
                            <label className="block text-sm mb-1">Date de fin prévue</label>
                            <div className="relative">
                                <input
                                    type="date"
                                    value={phase.endDate}
                                    onChange={(e) => handleDateChange(phaseIndex, 'endDate', e.target.value)}
                                    className={`w-full focus:outline-none focus:border-orangePtrm border border-gray-300 rounded px-3 py-2 ${dateErrors.phases[phaseIndex]?.endDate ? 'border-red-500' : ''}`}
                                    style={{
                                        ...inputStyle,
                                        colorScheme: 'light'
                                    }}
                                />
                                {dateErrors.phases[phaseIndex]?.endDate && (
                                    <p className="text-red-500 text-xs mt-1">{dateErrors.phases[phaseIndex].endDate}</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Operations */}
                    <div>
                        <div className="flex justify-between items-center mb-0">
                            <h3 className="font-medium">Opérations prévues</h3>
                            <button
                                type="button"
                                onClick={() => addOperation(phaseIndex)}
                                className="text-orange-500 bg-white hover:bg-orange-50 transition-all duration-200 flex items-center px-3 py-1.5 rounded-md shadow-sm border hover:border-1 focus:ring-1 focus:ring-orangePtrm hover:border-orangePtrm focus:outline-none border-orange-200"
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
                                                    className={`inline-block h-6 w-2 transform rounded-xl bg-white shadow transition-transform duration-200 ease-in-out ${operation.status ? 'translate-x-7' : 'translate-x-1'} border border-gray-100`} 
                                                />
                                            </button>
                                        </div>
                                        <div className="w-fit col-span-5 flex items-start">
                                            <input
                                                type="text"
                                                value={operation.name}
                                                onChange={(e) => handleOperationNameChange(phaseIndex, operation.id, e.target.value)}
                                                className="w-auto border-none focus:outline-none focus:ring-1 focus:ring-orange-300 px-1 py-1 rounded"
                                                style={{...inputStyle, backgroundColor: 'white'}}
                                            />
                                        </div>
                                        <div className="col-span-5 justify-between flex items-center">
                                            <input
                                                type="number"
                                                value={operation.cost}
                                                onChange={(e) => handleCostChange(phaseIndex, operation.id, Number(e.target.value))}
                                                className="w-24 border focus:outline-none focus:border-1 focus:border-orangePtrm border-gray-300 rounded px-3 py-1 text-right"
                                                style={{
                                                    ...inputStyle,
                                                    colorScheme: 'light'
                                                }}
                                            />

                                            <div className="col-span-1 text-center">
                                                <button
                                                    type="button"
                                                    onClick={() => deleteOperation(phaseIndex, operation.id)}
                                                    className="text-red-500 bg-white px-0 border-none focus:outline-none sm:mr-12 hover:text-red-800"
                                                    title="Supprimer l'opération"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mx-auto" fill="none"
                                                    viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                        d="M6 18L18 6M6 6l12 12" />
                                                    </svg>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-6 text-gray-400">No operations have been added yet.</div>
                        )}
                    </div>
                </div>
            ))}

            {/* Action Buttons */}
            <div className="flex justify-center space-x-6 mt-8">
                <button
                    type="button"
                    onClick={handleDiscard}
                    className="px-6 py-2 focus:outline-none focus:border-orangePtrm focus:ring-1 hover:border-orangePtrm focus:ring-orangePtrm bg-white border border-orange-300 text-orangePtrm rounded-md hover:bg-orange-50 transition-all duration-200 shadow-sm"
                >
                    Discard
                </button>
                <button
                    type="submit"
                    className="px-6 py-2 bg-orangePtrm focus:outline-none focus:border-orangePtrm focus:ring-1 focus:ring-orange-600 text-white rounded-md hover:bg-orange-600 transition-all duration-200 shadow-sm"
                >
                    Save
                </button>
            </div>
        </form>
    )
}