# frozen_string_literal: true

module Novabilling
  module CreditNotes
    module Types
      module ListCreditNotesRequestStatus
        extend Novabilling::Internal::Types::Enum

        DRAFT = "DRAFT"
        FINALIZED = "FINALIZED"
        VOIDED = "VOIDED"
      end
    end
  end
end
