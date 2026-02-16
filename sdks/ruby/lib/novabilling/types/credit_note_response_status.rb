# frozen_string_literal: true

module Novabilling
  module Types
    module CreditNoteResponseStatus
      extend Novabilling::Internal::Types::Enum

      DRAFT = "DRAFT"
      FINALIZED = "FINALIZED"
      VOIDED = "VOIDED"
    end
  end
end
