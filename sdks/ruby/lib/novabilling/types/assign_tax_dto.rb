# frozen_string_literal: true

module Novabilling
  module Types
    class AssignTaxDto < Internal::Types::Model
      field :tax_id, -> { String }, optional: false, nullable: false, api_name: "taxId"
    end
  end
end
