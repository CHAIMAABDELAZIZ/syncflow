package com.example.backend.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.backend.model.Operation;
import com.example.backend.repository.OperationRepository;
import com.example.backend.repository.PhaseRepository;
import com.example.backend.repository.TypeOperationRepository;
import com.example.backend.repository.UtilisateurRepository;

@Service
@Transactional
public class OperationService {

    @Autowired
    private OperationRepository operationRepository;
    
    @Autowired
    private PhaseRepository phaseRepository;
    
    @Autowired
    private TypeOperationRepository typeOperationRepository;
    
    @Autowired
    private UtilisateurRepository utilisateurRepository;

    public List<Operation> findAll() {
        return operationRepository.findAll();
    }

    public Optional<Operation> findById(Long id) {
        return operationRepository.findById(id);
    }
    
    public List<Operation> findByPhase(Long phaseId) {
        return phaseRepository.findById(phaseId)
                .map(phase -> operationRepository.findByPhase(phase))
                .orElse(List.of());
    }
    
    public List<Operation> findByTypeOperation(String typeOperationCode) {
        return typeOperationRepository.findById(typeOperationCode)
                .map(typeOperation -> operationRepository.findByTypeOperation(typeOperation))
                .orElse(List.of());
    }
    
    public List<Operation> findByCreatedBy(Long userId) {
        return utilisateurRepository.findById(userId)
                .map(user -> operationRepository.findByCreatedBy(user))
                .orElse(List.of());
    }
    
    public List<Operation> findByStatut(String statutLabel) {
        try {
            Operation.Statut statut = Operation.Statut.fromLabel(statutLabel);
            return operationRepository.findByStatut(statut);
        } catch (IllegalArgumentException e) {
            return List.of();
        }
    }

    public Operation create(Operation operation) {
        if (operation.getPhase() == null || operation.getPhase().getId() == null)
            throw new IllegalArgumentException("Phase non spécifiée ou ID manquant");

        if (operation.getTypeOperation() == null || operation.getTypeOperation().getCode() == null)
            throw new IllegalArgumentException("Type d'opération non spécifié");


        operation.setPhase(phaseRepository.findById(operation.getPhase().getId())
                .orElseThrow(() -> new IllegalArgumentException("Phase introuvable")));

        operation.setTypeOperation(typeOperationRepository.findById(operation.getTypeOperation().getCode())
                .orElseThrow(() -> new IllegalArgumentException("Type d'opération introuvable")));

        /*operation.setCreatedBy(utilisateurRepository.findById(operation.getCreatedBy().getId())
                .orElseThrow(() -> new IllegalArgumentException("Utilisateur introuvable")));*/

        if (operation.getCreatedAt() == null) {
            operation.setCreatedAt(LocalDateTime.now());
        }

        return operationRepository.save(operation);
    }

    public Optional<Operation> update(Long id, Operation operationData) {
        return operationRepository.findById(id)
                .map(operation -> {
                    // Handle Phase relationship
                    if (operationData.getPhase() != null && operationData.getPhase().getId() != null) {
                        phaseRepository.findById(operationData.getPhase().getId())
                                .ifPresent(operation::setPhase);
                    }

                    // Handle TypeOperation relationship
                    if (operationData.getTypeOperation() != null
                            && operationData.getTypeOperation().getCode() != null) {
                        typeOperationRepository.findById(operationData.getTypeOperation().getCode())
                                .ifPresent(operation::setTypeOperation);
                    }

                    if (operationData.getDescription() != null) {
                        operation.setDescription(operationData.getDescription());
                    }

                    if (operationData.getCoutPrev() != null) {
                        operation.setCoutPrev(operationData.getCoutPrev());
                    }

                    if (operationData.getCoutReel() != null) {
                        operation.setCoutReel(operationData.getCoutReel());
                    }

                    if (operationData.getStatut() != null) {
                        operation.setStatut(operationData.getStatut());
                    }

                    // Ne pas mettre à jour createdBy et createdAt
                    return operationRepository.save(operation);
                });
    }

    public boolean delete(Long id) {
        return operationRepository.findById(id)
            .map(operation -> {
                operationRepository.delete(operation);
                return true;
            })
            .orElse(false);
    }
}
