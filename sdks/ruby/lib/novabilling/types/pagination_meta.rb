# frozen_string_literal: true

module Novabilling
  module Types
    class PaginationMeta < Internal::Types::Model
      field :total, -> { Integer }, optional: false, nullable: false
      field :page, -> { Integer }, optional: false, nullable: false
      field :limit, -> { Integer }, optional: false, nullable: false
      field :total_pages, -> { Integer }, optional: false, nullable: false, api_name: "totalPages"
    end
  end
end
